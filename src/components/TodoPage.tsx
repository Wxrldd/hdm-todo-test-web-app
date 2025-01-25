  /**
   * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
   */
  import { Check, Delete } from '@mui/icons-material';
  import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
  import { useEffect, useState } from 'react';
  import useFetch from '../hooks/useFetch.ts';
  import { Task } from '../index';

  const TodoPage = () => {
    const api = useFetch();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskName, setNewTaskName] = useState<string>('');

    const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

    const handleDelete = async (id: number) => {
      try {
        await api.delete(`/tasks/${id}`); 
        handleFetchTasks();
      } catch (err){
        console.error("Error delete task :", err);
      }
    };

    const handleSave = async () => {
      if (newTaskName.trim() !== '') {
        try {
          await api.post('/tasks', { name: newTaskName });
          handleFetchTasks();
          setNewTaskName('');
        } catch (err) {
          console.error("Error saving task:", err);
        }
      } else {
        alert('Le nom de la tâche ne peut pas être vide');
      }
    }

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
          {
            tasks.map((task) => (
              <Box key={task.id}  display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
                <TextField size="small" value={task.name} fullWidth sx={{ maxWidth: 350 }} />
                <Box>
                  <IconButton color="success" disabled>
                    <Check />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(task.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            ))
          }

          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <TextField
            size="small"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            fullWidth
            sx={{ maxWidth: 350 }}
            placeholder="Nom de la tâche"
          />
            <Button variant="outlined" onClick={handleSave}>Créer une tâche</Button>
          </Box>
        </Box>
      </Container>
    );
  }

  export default TodoPage;
