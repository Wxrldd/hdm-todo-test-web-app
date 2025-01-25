import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setnewTask] = useState<string>('');
  const [editTask, seteditTask] = useState<number | null>(null);
  const [updateTask, setupdateTask] = useState<string>('');

  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      handleFetchTasks();
    } catch (err) {
      console.error("Error delete task:", err);
    }
  };

  const handleSave = async () => {
    if (newTask.trim() !== '') {
      try {
        await api.post('/tasks', { name: newTask });
        handleFetchTasks();
        setnewTask('');
      } catch (err) {
        console.error("Error saving task:", err);
      }
    } else {
      alert('Le nom de la tâche ne peut pas être vide');
    }
  };

  const handleEdit = (task: Task) => {
    seteditTask(task.id);
    setupdateTask(task.name);
  };

  const handleUpdate = async () => {
    if (updateTask.trim() !== '' && updateTask !== tasks.find(task => task.id === editTask)?.name) {
      try {
        await api.patch(`/tasks/${editTask}`, { name: updateTask });
        handleFetchTasks();
        seteditTask(null);
        setupdateTask('');
      } catch (err) {
        console.error("Error updating task:", err);
      }
    }
  };

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {tasks.map((task) => (
          <Box key={task.id} display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
            <TextField
              size="small"
              value={editTask === task.id ? updateTask : task.name}
              fullWidth
              sx={{ maxWidth: 350 }}
              onChange={(e) => setupdateTask(e.target.value)}
              disabled={editTask !== task.id}
            />
            <Box>
              {editTask === task.id ? (
                <IconButton color="success" onClick={handleUpdate}>
                  <Check />
                </IconButton>
              ) : (
                <IconButton color="success" onClick={() => handleEdit(task)}>
                  <Check />
                </IconButton>
              )}
              <IconButton color="error" onClick={() => handleDelete(task.id)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <TextField
            size="small"
            value={newTask}
            onChange={(e) => setnewTask(e.target.value)}
            fullWidth
            sx={{ maxWidth: 350 }}
            placeholder="Nom de la tâche"
          />
          <Button variant="outlined" onClick={handleSave}>Créer une tâche</Button>
          <Button variant="outlined" color="error" onClick={handleDeleteAll} sx={{ marginLeft: 2 }}>
            Supprimer toutes les tâches
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default TodoPage;
