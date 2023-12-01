const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sample in-memory database
let users = [
  { id: 1, name: 'abcd', email: 'abcde@gmail.com' },
];



// Render the user listing page
app.get('/', (req, res) => {
  res.render('index', { users });
});


// Create a new user
app.post('/users', (req, res) => {
  const newUser = req.body;

  // Check if user already exists
  const existingUser = users.find((u) => u.email === newUser.email);
  if (existingUser) {
    res.send('<script>alert("User already exists"); window.location.href = "/";</script>');
    return;
  }

  newUser.id = users.length + 1;
  users.push(newUser);

  res.redirect('/');
});



// Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter((u) => u.id !== userId);

  res.json({ message: 'User deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Add a new route for user editing
app.get('/users/edit/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.render('editUser', { user });
  } else {
    res.status(404).send('User not found');
  }
});

// Update user information
app.post('/users/update/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;
  const existingUser = users.find((u) => u.id === userId);

  if (existingUser) {
    Object.assign(existingUser, updatedUser);
    res.redirect('/');
  } else {
    res.status(404).send('User not found');
  }
});
