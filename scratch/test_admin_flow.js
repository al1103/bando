const BASE_URL = 'http://localhost:3000';

async function testAdminFlow() {
  console.log('--- Starting Admin Approval Flow Test ---');
  
  try {
    // 1. User Creates Property
    console.log('\n[1] User Login & Create Property...');
    const userLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser@example.com', password: 'password123' })
    });
    let userToken = (await userLoginRes.json()).token;

    // If testuser doesn't exist, register him
    if (!userToken) {
        await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'testuser@example.com', password: 'password123' })
        });
        const retry = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'testuser@example.com', password: 'password123' })
        });
        userToken = (await retry.json()).token;
    }

    const propRes = await fetch(`${BASE_URL}/properties`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        title: 'Admin Test Property',
        description: 'Waiting for approval',
        price: 5000, type: 'Villa', area: 200, address: 'Ocean Road',
        lat: 10.5, lng: 107.1
      })
    });
    const property = await propRes.json();
    console.log('Property created with status:', property.status);

    // 2. Admin Login
    console.log('\n[2] Admin Login...');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
    });
    const { token: adminToken } = await adminLoginRes.json();

    // 3. Admin Approve
    console.log('\n[3] Admin Approving Property...');
    const approveRes = await fetch(`${BASE_URL}/properties/${property.id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const approved = await approveRes.json();
    console.log('Approve result:', approved.status);

    // 4. Admin Reject (Test with another one)
    console.log('\n[4] Creating another property to Reject...');
    const prop2Res = await fetch(`${BASE_URL}/properties`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        title: 'Bad Property',
        description: 'Will be rejected',
        price: 10, type: 'Shack', area: 5, address: 'Slums',
        lat: 10.1, lng: 106.1
      })
    });
    const property2 = await prop2Res.json();

    console.log('[5] Admin Rejecting Property...');
    const rejectRes = await fetch(`${BASE_URL}/properties/${property2.id}/reject`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ rejectReason: 'Insufficient information and poor quality.' })
    });
    const rejected = await rejectRes.json();
    console.log('Reject result:', rejected.status, '| Reason:', rejected.rejectReason);

  } catch (error) {
    console.error('\n[ERROR] Admin test failed:', error.message);
  }
}

testAdminFlow();
