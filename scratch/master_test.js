const BASE_URL = 'http://localhost:3000';
const fs = require('fs');

async function runAllTests() {
  const results = [];
  
  async function logStep(name, method, url, body, headers = {}) {
    console.log(`Running: ${name}...`);
    try {
      const start = Date.now();
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      results.push({
        name,
        method,
        url,
        requestBody: body,
        status: res.status,
        duration: `${Date.now() - start}ms`,
        response: data
      });
      return data;
    } catch (error) {
      results.push({ name, method, url, status: 'ERROR', error: error.message });
      return null;
    }
  }

  // 1. Auth & User
  await logStep('Register User', 'POST', `${BASE_URL}/auth/register`, { email: 'user_full_test@example.com', password: 'password123' });
  const loginData = await logStep('Login User', 'POST', `${BASE_URL}/auth/login`, { email: 'user_full_test@example.com', password: 'password123' });
  const userToken = loginData?.token;
  const authHeader = { Authorization: `Bearer ${userToken}` };

  await logStep('Get Profile', 'GET', `${BASE_URL}/users/me`, null, authHeader);

  // 2. Property Flow
  const prop = await logStep('Create Property', 'POST', `${BASE_URL}/properties`, {
    title: 'Full Test Villa', description: 'Testing all endpoints', price: 9999, type: 'Villa', area: 500, address: 'Test St', lat: 10, lng: 106
  }, authHeader);
  
  const propId = prop?.id;
  await logStep('Get Public Properties', 'GET', `${BASE_URL}/properties`);
  await logStep('Get My Properties', 'GET', `${BASE_URL}/properties/my`, null, authHeader);
  await logStep('Get Property Detail', 'GET', `${BASE_URL}/properties/${propId}`);
  await logStep('Update Property', 'PUT', `${BASE_URL}/properties/${propId}`, { title: 'Updated Villa Name' }, authHeader);
  await logStep('Nearby Search', 'GET', `${BASE_URL}/properties/nearby?lat=10&lng=106&radius=5000`);

  // 3. Admin Flow
  const adminLogin = await logStep('Login Admin', 'POST', `${BASE_URL}/auth/login`, { email: 'admin@example.com', password: 'admin123' });
  const adminAuth = { Authorization: `Bearer ${adminLogin?.token}` };
  
  await logStep('Admin List Properties', 'GET', `${BASE_URL}/properties/admin/properties`, null, adminAuth);
  await logStep('Approve Property', 'PUT', `${BASE_URL}/properties/${propId}/approve`, null, adminAuth);
  await logStep('Reject Property', 'PUT', `${BASE_URL}/properties/${propId}/reject`, { rejectReason: 'Test Reject' }, adminAuth);

  // 4. Favorite Flow
  await logStep('Add Favorite', 'POST', `${BASE_URL}/favorites/${propId}`, null, authHeader);
  await logStep('List Favorites', 'GET', `${BASE_URL}/favorites`, null, authHeader);
  await logStep('Remove Favorite', 'DELETE', `${BASE_URL}/favorites/${propId}`, null, authHeader);

  // 5. Cleanup (Delete Property)
  await logStep('Delete Property', 'DELETE', `${BASE_URL}/properties/${propId}`, null, authHeader);

  fs.writeFileSync('scratch/full_test_report.json', JSON.stringify(results, null, 2));
  console.log('Results saved to scratch/full_test_report.json');
}

runAllTests();
