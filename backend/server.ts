import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Fix: Explicitly cast middleware to any to resolve 'NextHandleFunction' vs 'RequestHandler' type mismatch common in certain TypeScript/Express environments
app.use(cors() as any);
app.use(express.json() as any);

// In-memory Roster Management
// DriverID -> { name, routeNumber, status }
const dutyRoster: Record<string, { name: string, routeNumber: string | null, status: string }> = {
  'EMP101': { name: 'Ramesh Kumar', routeNumber: null, status: 'Offline' },
  'EMP102': { name: 'Suresh Singh', routeNumber: null, status: 'Offline' },
  'EMP103': { name: 'Mukesh Sharma', routeNumber: null, status: 'Offline' },
  'EMP104': { name: 'Dinesh Patel', routeNumber: null, status: 'Offline' },
  'EMP105': { name: 'Vikram Singh', routeNumber: null, status: 'Offline' },
};

// --- AUTH ENDPOINTS ---

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'udaipur2026') {
    return res.json({ token: 'mock-admin-token-2026', user: 'Admin' });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// --- DUTY ENDPOINTS ---

app.get('/api/drivers', (req, res) => {
  res.json(Object.entries(dutyRoster).map(([id, data]) => ({ id, ...data })));
});

app.post('/api/assign-duty', (req, res) => {
  const { driverId, routeNumber } = req.body;
  if (!dutyRoster[driverId]) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  dutyRoster[driverId].routeNumber = routeNumber;
  dutyRoster[driverId].status = 'Assigned';
  
  console.log(`[Command Center] Assigned ${driverId} to Route ${routeNumber}`);
  res.json({ success: true, duty: dutyRoster[driverId] });
});

app.get('/api/driver-check/:id', (req, res) => {
  const { id } = req.params;
  const duty = dutyRoster[id];
  if (!duty) {
    return res.status(404).json({ error: 'Employee ID not recognized' });
  }
  res.json(duty);
});

// For backward compatibility with simpler driver apps
app.get('/api/my-duty', (req, res) => {
  const { driverId } = req.query;
  const duty = dutyRoster[driverId as string];
  if (!duty || !duty.routeNumber) {
    return res.status(404).json({ error: 'No duty assigned' });
  }
  res.json({ routeNumber: duty.routeNumber });
});

// --- REAL-TIME ENGINE ---

io.on('connection', (socket) => {
  socket.on('driver-location-update', (payload) => {
    // Update local roster status if live
    if (dutyRoster[payload.driverId]) {
      dutyRoster[payload.driverId].status = 'On Duty';
    }
    io.emit('bus-location-changed', payload);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`UdaipurLink Mission Control Server running on port ${PORT}`);
});