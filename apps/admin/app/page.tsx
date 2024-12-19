'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

type Workout = {
  id: number;
  name: string;
  location: string;
  mapsUrl: string;
  schedule: string;
  eventType: string;
  sortOrder?: number;
};

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingWorkoutId, setEditingWorkoutId] = useState<number | null>(null);
  const [editedWorkout, setEditedWorkout] = useState<Partial<Workout>>({});
  const [editedErrors, setEditedErrors] = useState<Record<string, boolean>>({});
  const [newWorkout, setNewWorkout] = useState<Omit<Workout, 'id'>>({
    name: '',
    location: '',
    mapsUrl: '',
    schedule: '',
    eventType: '',
    sortOrder: 0, // Default sortOrder
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Fetch workouts from API
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('/api/workouts');
        const data = await response.json();
        const sortedData = data.sort((a: Workout, b: Workout) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setWorkouts(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleNewWorkoutChange = (field: keyof Omit<Workout, 'id'>, value: string) => {
    setNewWorkout((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleEditChange = (field: keyof Workout, value: string) => {
    setEditedWorkout((prev) => ({ ...prev, [field]: value }));
    setEditedErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleEditClick = (workout: Workout) => {
    setEditingWorkoutId(workout.id);
    setEditedWorkout(workout);
    setEditedErrors({});
  };

  const handleCancelEdit = () => {
    setEditingWorkoutId(null);
    setEditedWorkout({});
    setEditedErrors({});
  };

  /**
   * TODO: propagate sortOrder change on delete
   * TODO: soft delete / deletedAt
   */
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }

      setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/workouts/${editingWorkoutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedWorkout),
      });

      if (!response.ok) {
        throw new Error('Failed to update workout');
      }

      const updatedWorkout = await response.json();
      setWorkouts((prev) =>
        prev.map((workout) =>
          workout.id === editingWorkoutId ? updatedWorkout : workout
        )
      );

      setEditingWorkoutId(null);
      setEditedWorkout({});
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const handleSortOrderChange = async (id: number, direction: 'up' | 'down') => {
    try {
      const currentWorkout = workouts.find((workout) => workout.id === id);
      if (!currentWorkout) return;

      const currentIndex = workouts.indexOf(currentWorkout);
      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      // Ensure the index is within bounds
      if (swapIndex < 0 || swapIndex >= workouts.length) return;

      const swapWorkout = workouts[swapIndex];

      // Swap sort orders
      await Promise.all([
        fetch(`/api/workouts/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sortOrder: swapWorkout.sortOrder }),
        }),
        fetch(`/api/workouts/${swapWorkout.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sortOrder: currentWorkout.sortOrder }),
        }),
      ]);

      // Swap in local state
      const updatedWorkouts = [...workouts];
      updatedWorkouts[currentIndex] = swapWorkout;
      updatedWorkouts[swapIndex] = currentWorkout;

      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error changing sort order:', error);
    }
  };

  const isFieldValid = (field: keyof Omit<Workout, 'id'>, value: string): boolean => {
    if (!value) return false;

    if (field === 'mapsUrl') return isValidUrl(value);
    return true;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      return new URL(url) && url.startsWith('https');
    } catch {
      return false;
    }
  };

  const handleBlur = (
    field: keyof Omit<Workout, 'id'>,
    value: string,
    errorSetter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    errorSetter((prev) => ({ ...prev, [field]: !isFieldValid(field, value) }));
  };

  const isValidForm = (form: Partial<Workout>, errorState: Record<string, boolean>): boolean => {
    return Object.keys(form).every((key) => {
      const field = key as keyof Workout;
      /** HACK */
      if(field === 'sortOrder') return true;
      const value = form[field];
      
      // Check if the field is a string and validate accordingly
      return typeof value === 'string' && isFieldValid(field as keyof Omit<Workout, 'id'>, value) && !errorState[key];
    });
  };

  const handleCreateWorkout = async () => {
    try {
      // Calculate the next available sortOrder
      const nextSortOrder = workouts.length > 0 
        ? Math.max(...workouts.map((workout) => workout.sortOrder ?? 0)) + 1 
        : 0;
  
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newWorkout, sortOrder: nextSortOrder }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create workout');
      }
  
      const createdWorkout = await response.json();
      setWorkouts((prev) => [...prev, createdWorkout]);
  
      // Reset new workout form
      setNewWorkout({
        name: '',
        location: '',
        mapsUrl: '',
        schedule: '',
        eventType: '',
      });
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Workouts
      </Typography>

    {/* Create New Workout Form */}
    <Paper style={{ padding: 16, marginBottom: 16 }}>
      <Typography variant="h6" gutterBottom>
        Create a New Workout
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            value={newWorkout.name}
            onChange={(e) => handleNewWorkoutChange('name', e.target.value)}
            onBlur={(e) => handleBlur('name', e.target.value, setErrors)}
            error={errors['name']}
            helperText={errors['name'] ? 'Name is required' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location"
            value={newWorkout.location}
            onChange={(e) => handleNewWorkoutChange('location', e.target.value)}
            onBlur={(e) => handleBlur('location', e.target.value, setErrors)}
            error={errors['location']}
            helperText={errors['location'] ? 'Location is required' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Maps URL"
            value={newWorkout.mapsUrl}
            onChange={(e) => handleNewWorkoutChange('mapsUrl', e.target.value)}
            onBlur={(e) => handleBlur('mapsUrl', e.target.value, setErrors)}
            error={errors['mapsUrl']}
            helperText={errors['mapsUrl'] ? 'Enter a valid https URL' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Schedule"
            value={newWorkout.schedule}
            onChange={(e) => handleNewWorkoutChange('schedule', e.target.value)}
            onBlur={(e) => handleBlur('schedule', e.target.value, setErrors)}
            error={errors['schedule']}
            helperText={errors['schedule'] ? 'Schedule is required' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Event Type"
            value={newWorkout.eventType}
            onChange={(e) => handleNewWorkoutChange('eventType', e.target.value)}
            onBlur={(e) => handleBlur('eventType', e.target.value, setErrors)}
            error={errors['eventType']}
            helperText={errors['eventType'] ? 'Event Type is required' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateWorkout}
            disabled={!isValidForm(newWorkout, errors)}
          >
            Create Workout
          </Button>
        </Grid>
      </Grid>
    </Paper>

    {/* Existing Workouts Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Maps URL</TableCell>
                <TableCell>Schedule</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Sort Order</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workouts.map((workout, index) => (
                <TableRow key={workout.id}>
                  {editingWorkoutId === workout.id ? (
                    <>
                      <TableCell>
                        <TextField
                          value={editedWorkout.name || ''}
                          onChange={(e) => handleEditChange('name', e.target.value)}
                          onBlur={(e) => handleBlur('name', e.target.value, setEditedErrors)}
                          error={editedErrors['name']}
                          helperText={editedErrors['name'] ? 'Required' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedWorkout.location || ''}
                          onChange={(e) => handleEditChange('location', e.target.value)}
                          onBlur={(e) => handleBlur('location', e.target.value, setEditedErrors)}
                          error={editedErrors['location']}
                          helperText={editedErrors['location'] ? 'Required' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedWorkout.mapsUrl || ''}
                          onChange={(e) => handleEditChange('mapsUrl', e.target.value)}
                          onBlur={(e) => handleBlur('mapsUrl', e.target.value, setEditedErrors)}
                          error={editedErrors['mapsUrl']}
                          helperText={editedErrors['mapsUrl'] ? 'Enter a valid URL' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedWorkout.schedule || ''}
                          onChange={(e) => handleEditChange('schedule', e.target.value)}
                          onBlur={(e) => handleBlur('schedule', e.target.value, setEditedErrors)}
                          error={editedErrors['schedule']}
                          helperText={editedErrors['schedule'] ? 'Required' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editedWorkout.eventType || ''}
                          onChange={(e) => handleEditChange('eventType', e.target.value)}
                          onBlur={(e) => handleBlur('eventType', e.target.value, setEditedErrors)}
                          error={editedErrors['eventType']}
                          helperText={editedErrors['eventType'] ? 'Required' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={handleSaveEdit}
                          color="primary"
                          disabled={!isValidForm(editedWorkout, editedErrors)} // Disable until valid
                        >
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit} color="secondary">
                          Cancel
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{workout.name}</TableCell>
                      <TableCell>{workout.location}</TableCell>
                      <TableCell>
                        <a href={workout.mapsUrl} target="_blank" rel="noopener noreferrer">
                          Map
                        </a>
                      </TableCell>
                      <TableCell>{workout.schedule}</TableCell>
                      <TableCell>{workout.eventType}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleSortOrderChange(workout.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleSortOrderChange(workout.id, 'down')}
                          disabled={index === workouts.length - 1}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                        <Button color="primary" onClick={() => handleEditClick(workout)}>
                          Edit
                        </Button>
                        <Button color="secondary" onClick={() => handleDelete(workout.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </>
                  )}
</TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}