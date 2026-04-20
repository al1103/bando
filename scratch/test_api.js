const BASE_URL = 'http://localhost:3000';

async function testFlow() {
  console.log('--- Starting API Test Flow ---');
  
  try {
    // 1. Register
    console.log('\n[1] Registering User...');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test_${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    console.log('Register Response:', regData);

    // 2. Login
    console.log('\n[2] Logging In...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regData.email,
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login Response:', loginData);

    // 3. Get Me
    if (token) {
      console.log('\n[3] Getting Profile...');
      const meRes = await fetch(`${BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Profile:', await meRes.json());
    }

    // 4. Create Property
    if (token) {
      console.log('\n[4] Creating Property...');
      const propRes = await fetch(`${BASE_URL}/properties`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          title: 'Test Property',
          description: 'Test description',
          price: 1000,
          type: 'House',
          area: 100,
          address: 'Test Address',
          lat: 10,
          lng: 106
        })
      });
      console.log('Create Property Response:', await propRes.json());
    }

  } catch (error) {
    console.error('\n[ERROR] Test failed:', error.message);
  }
}

testFlow();
