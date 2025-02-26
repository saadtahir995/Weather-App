import express from 'express';
import config from '../config/config.js';

const app = express();
app.use(config);

// Sample cities data (you can expand this list)
const cities = [
  { name: 'London', country: 'United Kingdom' },
  { name: 'Paris', country: 'France' },
  { name: 'New York', country: 'United States' },
  { name: 'Tokyo', country: 'Japan' },
  { name: 'Dubai', country: 'United Arab Emirates' },
  { name: 'Singapore', country: 'Singapore' },
  { name: 'Hong Kong', country: 'China' },
  { name: 'Los Angeles', country: 'United States' },
  { name: 'Barcelona', country: 'Spain' },
  { name: 'Madrid', country: 'Spain' },
  { name: 'Rome', country: 'Italy' },
  { name: 'Milan', country: 'Italy' },
  { name: 'Berlin', country: 'Germany' },
  { name: 'Munich', country: 'Germany' },
  { name: 'Amsterdam', country: 'Netherlands' },
  { name: 'Moscow', country: 'Russia' },
  { name: 'Beijing', country: 'China' },
  { name: 'Shanghai', country: 'China' },
  { name: 'Seoul', country: 'South Korea' },
  { name: 'Sydney', country: 'Australia' },
  { name: 'Melbourne', country: 'Australia' },
  { name: 'Toronto', country: 'Canada' },
  { name: 'Vancouver', country: 'Canada' },
  { name: 'Mumbai', country: 'India' },
  { name: 'Delhi', country: 'India' },
  { name: 'Bangalore', country: 'India' },
  { name: 'Lahore', country: 'Pakistan' },
  { name: 'Karachi', country: 'Pakistan' },
  { name: 'Istanbul', country: 'Turkey' },
  { name: 'Cairo', country: 'Egypt' },
  { name: 'Lagos', country: 'Nigeria' },
  { name: 'Cape Town', country: 'South Africa' },
  { name: 'Rio de Janeiro', country: 'Brazil' },
  { name: 'São Paulo', country: 'Brazil' },
  { name: 'Buenos Aires', country: 'Argentina' },
];

app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const searchQuery = q.toLowerCase();
    const filteredCities = cities
      .filter(city => 
        city.name.toLowerCase().includes(searchQuery) ||
        city.country.toLowerCase().includes(searchQuery)
      )
      .slice(0, 5);

    res.json(filteredCities);
  } catch (error) {
    console.error('Error searching cities:', error);
    res.status(500).json({ error: 'Failed to search cities' });
  }
});

export default app; 