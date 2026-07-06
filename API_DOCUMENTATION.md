<ul><li><h1>Tamil Nadu Blood Bank Management System - API Documentation</h1></li></ul><p><strong>Base URL:</strong> <code>http://localhost:5000/api</code><br><strong>Version:</strong> 1.0.0</p><hr><h2>Table of Contents</h2><ol> <li><a href="#authentication">Authentication</a></li> <li><a href="#donor-apis">Donor APIs</a></li> <li><a href="#blood-bank-apis">Blood Bank APIs</a></li> <li><a href="#hospital-apis">Hospital APIs</a></li> <li><a href="#blood-request-apis">Blood Request APIs</a></li> <li><a href="#donation-camp-apis">Donation Camp APIs</a></li> <li><a href="#admin-apis">Admin APIs</a></li> <li><a href="#feedback-apis">Feedback APIs</a></li> <li><a href="#error-responses">Error Responses</a></li> <li><a href="#test-credentials">Test Credentials</a></li> </ol><hr><h2>Authentication</h2><p>All protected endpoints require a JWT token in the Authorization header:</p><pre><code>Authorization: Bearer &lt;token&gt;
</code></pre><h3>POST /api/auth/register</h3><p>Register a new user.</p><p><strong>Access:</strong> Public</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "name": "User Name",
  "email": "user@example.com",
  "mobile": "9876543210",
  "password": "password123",
  "role": "donor"
}
</code></pre><p><strong>Role Options:</strong> <code>admin</code>, <code>hospital</code>, <code>bloodbank</code>, <code>donor</code></p><p><strong>Response (201):</strong></p><pre><code class="language-json">{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "User Name",
      "email": "user@example.com",
      "mobile": "9876543210",
      "role": "donor"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
</code></pre><h3>POST /api/auth/login</h3><p>Login and get JWT token.</p><p><strong>Access:</strong> Public</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "email": "user@example.com",
  "password": "password123"
}
</code></pre><p><strong>Response (200):</strong></p><pre><code class="language-json">{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "name": "User Name",
      "email": "user@example.com",
      "mobile": "9876543210",
      "role": "donor"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
</code></pre><h3>GET /api/auth/me</h3><p>Get current user profile.</p><p><strong>Access:</strong> Authenticated User</p><p><strong>Response (200):</strong></p><pre><code class="language-json">{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "user": { "..." },
    "profile": null
  }
}
</code></pre><h3>PUT /api/auth/profile</h3><p>Update user profile (name, mobile).</p><p><strong>Access:</strong> Authenticated User</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "name": "Updated Name",
  "mobile": "9876543211"
}
</code></pre><h3>PUT /api/auth/change-password</h3><p>Change user password.</p><p><strong>Access:</strong> Authenticated User</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
</code></pre><hr><h2>Donor APIs</h2><h3>GET /api/donors</h3><p>List all donors with filtering and pagination.</p><p><strong>Access:</strong> Authenticated User</p><p><strong>Query Parameters:</strong></p><table class="e-rte-table"> <thead> <tr> <th>Parameter</th> <th>Type</th> <th>Description</th> </tr> </thead> <tbody><tr> <td>bloodGroup</td> <td>string</td> <td>Filter by blood group (A+, A-, B+, B-, AB+, AB-, O+, O-)</td> </tr> <tr> <td>district</td> <td>string</td> <td>Filter by district</td> </tr> <tr> <td>availability</td> <td>string</td> <td>Filter by availability (available, unavailable, deferred)</td> </tr> <tr> <td>page</td> <td>number</td> <td>Page number (default: 1)</td> </tr> <tr> <td>limit</td> <td>number</td> <td>Items per page (default: 10)</td> </tr> </tbody></table><p><strong>Response (200):</strong></p><pre><code class="language-json">{
  "success": true,
  "message": "Donors retrieved successfully",
  "data": [ { "..." } ],
  "meta": {
    "total": 10,
    "page": 1,
    "pages": 1
  }
}
</code></pre><h3>GET /api/donors/:id</h3><p>Get a single donor by ID.</p><p><strong>Access:</strong> Authenticated User</p><h3>POST /api/donors/register</h3><p>Register as a donor (creates donor profile).</p><p><strong>Access:</strong> Donor Role</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "bloodGroup": "O+",
  "age": 28,
  "weight": 72,
  "lastDonationDate": "2024-08-15",
  "availability": "available",
  "address": {
    "street": "45 Anna Nagar",
    "city": "Chennai",
    "district": "Chennai",
    "pincode": "600040"
  }
}
</code></pre><h3>PUT /api/donors/update</h3><p>Update donor profile.</p><p><strong>Access:</strong> Donor Role</p><p><strong>Request Body:</strong> Same as register (all fields optional)</p><h3>DELETE /api/donors/delete</h3><p>Delete donor profile.</p><p><strong>Access:</strong> Donor, Admin</p><hr><h2>Blood Bank APIs</h2><h3>GET /api/bloodbanks</h3><p>List all blood banks with filtering and pagination.</p><p><strong>Access:</strong> Authenticated User</p><p><strong>Query Parameters:</strong></p><table class="e-rte-table"> <thead> <tr> <th>Parameter</th> <th>Type</th> <th>Description</th> </tr> </thead> <tbody><tr> <td>district</td> <td>string</td> <td>Filter by district</td> </tr> <tr> <td>page</td> <td>number</td> <td>Page number</td> </tr> <tr> <td>limit</td> <td>number</td> <td>Items per page</td> </tr> </tbody></table><h3>GET /api/bloodbanks/:id</h3><p>Get a single blood bank by ID.</p><p><strong>Access:</strong> Authenticated User</p><h3>POST /api/bloodbanks</h3><p>Create a new blood bank.</p><p><strong>Access:</strong> Admin, Blood Bank</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "name": "Chennai Government Blood Bank",
  "district": "Chennai",
  "contact": {
    "phone": "9445200100",
    "email": "chennai.bb@tnbbms.gov.in"
  },
  "location": {
    "coordinates": [80.2785, 13.0827],
    "address": "Egmore, Chennai - 600008"
  },
  "operatingHours": {
    "open": "08:00",
    "close": "20:00"
  },
  "bloodStock": [
    { "bloodGroup": "A+", "units": 45 },
    { "bloodGroup": "A-", "units": 12 },
    { "bloodGroup": "B+", "units": 38 },
    { "bloodGroup": "B-", "units": 8 },
    { "bloodGroup": "AB+", "units": 15 },
    { "bloodGroup": "AB-", "units": 5 },
    { "bloodGroup": "O+", "units": 55 },
    { "bloodGroup": "O-", "units": 10 }
  ]
}
</code></pre><h3>PUT /api/bloodbanks/:id</h3><p>Update blood bank details.</p><p><strong>Access:</strong> Admin, Blood Bank</p><h3>PUT /api/bloodbanks/:id/stock</h3><p>Update blood stock for a specific blood group.</p><p><strong>Access:</strong> Admin, Blood Bank</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "bloodGroup": "O+",
  "units": 60
}
</code></pre><h3>DELETE /api/bloodbanks/:id</h3><p>Delete a blood bank.</p><p><strong>Access:</strong> Admin</p><h3>GET /api/bloodbanks/search?group=A+&amp;district=Chennai</h3><p>Search blood availability across blood banks.</p><p><strong>Access:</strong> Authenticated User</p><p><strong>Query Parameters:</strong></p><table class="e-rte-table"> <thead> <tr> <th>Parameter</th> <th>Type</th> <th>Required</th> <th>Description</th> </tr> </thead> <tbody><tr> <td>group</td> <td>string</td> <td>Yes</td> <td>Blood group to search (A+, A-, B+, B-, AB+, AB-, O+, O-)</td> </tr> <tr> <td>district</td> <td>string</td> <td>No</td> <td>Filter by district</td> </tr> </tbody></table><p><strong>Response (200):</strong></p><pre><code class="language-json">{
  "success": true,
  "message": "Blood availability search results",
  "data": [
    {
      "_id": "...",
      "name": "Chennai Government Blood Bank",
      "district": "Chennai",
      "contact": { "phone": "9445200100" },
      "availableUnits": 55,
      "bloodGroup": "A+"
    }
  ],
  "meta": {
    "bloodGroup": "A+",
    "totalBanks": 3
  }
}
</code></pre><hr><h2>Hospital APIs</h2><h3>GET /api/hospitals</h3><p>List all hospitals with filtering and pagination.</p><p><strong>Access:</strong> Authenticated User</p><p><strong>Query Parameters:</strong></p><table class="e-rte-table"> <thead> <tr> <th>Parameter</th> <th>Type</th> <th>Description</th> </tr> </thead> <tbody><tr> <td>district</td> <td>string</td> <td>Filter by district</td> </tr> <tr> <td>page</td> <td>number</td> <td>Page number</td> </tr> <tr> <td>limit</td> <td>number</td> <td>Items per page</td> </tr> </tbody></table><h3>GET /api/hospitals/:id</h3><p>Get a single hospital by ID.</p><p><strong>Access:</strong> Authenticated User</p><h3>POST /api/hospitals</h3><p>Create/register a hospital.</p><p><strong>Access:</strong> Admin, Hospital</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "name": "Govt General Hospital",
  "address": {
    "street": "Chennai - Egmore",
    "city": "Chennai",
    "district": "Chennai",
    "pincode": "600008"
  },
  "contact": {
    "phone": "9445100100",
    "email": "ggh.chennai@tn.gov.in",
    "emergencyPhone": "044-25360501"
  }
}
</code></pre><h3>PUT /api/hospitals/:id</h3><p>Update hospital details.</p><p><strong>Access:</strong> Admin, Hospital</p><h3>DELETE /api/hospitals/:id</h3><p>Delete a hospital.</p><p><strong>Access:</strong> Admin</p><hr><h2>Blood Request APIs</h2><h3>POST /api/blood/request</h3><p>Create a new blood request.</p><p><strong>Access:</strong> Hospital, Admin</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "patientName": "Ramesh K",
  "hospital": "hospital_id",
  "bloodGroup": "O-",
  "unitsRequired": 3,
  "urgency": "critical",
  "reason": "Emergency surgery - severe blood loss",
  "requiredDate": "2024-12-15"
}
</code></pre><p><strong>Urgency Options:</strong> <code>normal</code>, <code>urgent</code>, <code>critical</code></p><h3>GET /api/blood/request</h3><p>List all blood requests with filtering.</p><p><strong>Access:</strong> Authenticated User</p><p><strong>Query Parameters:</strong></p><table class="e-rte-table"> <thead> <tr> <th>Parameter</th> <th>Type</th> <th>Description</th> </tr> </thead> <tbody><tr> <td>status</td> <td>string</td> <td>Filter by status (pending, approved, fulfilled, rejected, cancelled)</td> </tr> <tr> <td>bloodGroup</td> <td>string</td> <td>Filter by blood group</td> </tr> <tr> <td>urgency</td> <td>string</td> <td>Filter by urgency</td> </tr> <tr> <td>page</td> <td>number</td> <td>Page number</td> </tr> <tr> <td>limit</td> <td>number</td> <td>Items per page</td> </tr> </tbody></table><h3>GET /api/blood/request/emergency</h3><p>Get all pending emergency/urgent blood requests.</p><p><strong>Access:</strong> Authenticated User</p><h3>GET /api/blood/request/:id</h3><p>Get a single blood request by ID.</p><p><strong>Access:</strong> Authenticated User</p><h3>PUT /api/blood/request/:id</h3><p>Update blood request status.</p><p><strong>Access:</strong> Admin, Blood Bank</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "status": "approved",
  "unitsFulfilled": 2
}
</code></pre><h3>DELETE /api/blood/request/:id</h3><p>Delete a blood request.</p><p><strong>Access:</strong> Admin</p><hr><h2>Donation Camp APIs</h2><h3>GET /api/camps</h3><p>List all donation camps with filtering.</p><p><strong>Access:</strong> Authenticated User</p><p><strong>Query Parameters:</strong></p><table class="e-rte-table"> <thead> <tr> <th>Parameter</th> <th>Type</th> <th>Description</th> </tr> </thead> <tbody><tr> <td>district</td> <td>string</td> <td>Filter by district</td> </tr> <tr> <td>isActive</td> <td>boolean</td> <td>Filter by active status</td> </tr> <tr> <td>page</td> <td>number</td> <td>Page number</td> </tr> <tr> <td>limit</td> <td>number</td> <td>Items per page</td> </tr> </tbody></table><h3>GET /api/camps/:id</h3><p>Get a single donation camp by ID.</p><p><strong>Access:</strong> Authenticated User</p><h3>POST /api/camps</h3><p>Create a new donation camp.</p><p><strong>Access:</strong> Admin, Blood Bank</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "campName": "Chennai Mega Blood Donation Drive",
  "date": "2025-01-15",
  "time": { "start": "08:00", "end": "18:00" },
  "venue": "Chennai Trade Centre, Nandambakkam",
  "organizer": "Tamil Nadu Health Department",
  "district": "Chennai",
  "contactPhone": "9445100100",
  "expectedDonors": 500
}
</code></pre><h3>PUT /api/camps/:id</h3><p>Update donation camp details.</p><p><strong>Access:</strong> Admin, Blood Bank</p><h3>DELETE /api/camps/:id</h3><p>Delete a donation camp.</p><p><strong>Access:</strong> Admin</p><hr><h2>Admin APIs</h2><h3>GET /api/admin/dashboard</h3><p>Get dashboard statistics.</p><p><strong>Access:</strong> Admin</p><p><strong>Response (200):</strong></p><pre><code class="language-json">{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalDonors": 10,
    "totalBloodBanks": 5,
    "totalHospitals": 4,
    "availableBloodUnits": 590,
    "bloodGroupWiseStock": {
      "A+": 140, "A-": 36, "B+": 113, "B-": 25,
      "AB+": 48, "AB-": 14, "O+": 182, "O-": 32
    },
    "pendingRequests": 3,
    "fulfilledRequests": 2,
    "urgentRequests": 3,
    "activeCamps": 3,
    "donorsByBloodGroup": [
      { "_id": "O+", "count": 2 },
      { "_id": "A+", "count": 2 }
    ],
    "recentRequests": [ "..." ]
  }
}
</code></pre><h3>GET /api/admin/users</h3><p>List all users with role filtering.</p><p><strong>Access:</strong> Admin</p><p><strong>Query Parameters:</strong></p><table class="e-rte-table"> <thead> <tr> <th>Parameter</th> <th>Type</th> <th>Description</th> </tr> </thead> <tbody><tr> <td>role</td> <td>string</td> <td>Filter by role (admin, hospital, bloodbank, donor)</td> </tr> <tr> <td>page</td> <td>number</td> <td>Page number</td> </tr> <tr> <td>limit</td> <td>number</td> <td>Items per page</td> </tr> </tbody></table><h3>DELETE /api/admin/users/:id</h3><p>Delete a user.</p><p><strong>Access:</strong> Admin</p><h3>GET /api/admin/notifications</h3><p>List all notifications.</p><p><strong>Access:</strong> Authenticated User</p><p><strong>Query Parameters:</strong></p><table class="e-rte-table"> <thead> <tr> <th>Parameter</th> <th>Type</th> <th>Description</th> </tr> </thead> <tbody><tr> <td>type</td> <td>string</td> <td>Filter by type (info, urgent, camp, request, general)</td> </tr> <tr> <td>page</td> <td>number</td> <td>Page number</td> </tr> <tr> <td>limit</td> <td>number</td> <td>Items per page</td> </tr> </tbody></table><h3>POST /api/admin/notifications</h3><p>Create a notification.</p><p><strong>Access:</strong> Admin</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "title": "Critical: O- Blood Shortage",
  "description": "Chennai blood banks face critical O- shortage.",
  "type": "urgent",
  "date": "2024-12-10"
}
</code></pre><h3>PUT /api/admin/notifications/:id</h3><p>Update a notification.</p><p><strong>Access:</strong> Admin</p><h3>DELETE /api/admin/notifications/:id</h3><p>Delete a notification.</p><p><strong>Access:</strong> Admin</p><hr><h2>Feedback APIs</h2><h3>POST /api/feedback</h3><p>Submit feedback.</p><p><strong>Access:</strong> Authenticated User</p><p><strong>Request Body:</strong></p><pre><code class="language-json">{
  "name": "User Name",
  "rating": 5,
  "message": "Excellent service!",
  "category": "service"
}
</code></pre><p><strong>Category Options:</strong> <code>service</code>, <code>app</code>, <code>camp</code>, <code>bloodbank</code>, <code>general</code></p><h3>GET /api/feedback</h3><p>List all feedbacks (with average rating).</p><p><strong>Access:</strong> Admin</p><p><strong>Query Parameters:</strong></p><table class="e-rte-table"> <thead> <tr> <th>Parameter</th> <th>Type</th> <th>Description</th> </tr> </thead> <tbody><tr> <td>category</td> <td>string</td> <td>Filter by category</td> </tr> <tr> <td>rating</td> <td>number</td> <td>Filter by rating (1-5)</td> </tr> <tr> <td>page</td> <td>number</td> <td>Page number</td> </tr> <tr> <td>limit</td> <td>number</td> <td>Items per page</td> </tr> </tbody></table><h3>GET /api/feedback/:id</h3><p>Get a single feedback by ID.</p><p><strong>Access:</strong> Admin</p><h3>DELETE /api/feedback/:id</h3><p>Delete a feedback.</p><p><strong>Access:</strong> Admin</p><hr><h2>Error Responses</h2><p>All errors follow this format:</p><pre><code class="language-json">{
  "success": false,
  "message": "Error description"
}
</code></pre><table class="e-rte-table"> <thead> <tr> <th>Status Code</th> <th>Description</th> </tr> </thead> <tbody><tr> <td>400</td> <td>Bad Request / Validation Error</td> </tr> <tr> <td>401</td> <td>Unauthorized / Invalid Token</td> </tr> <tr> <td>403</td> <td>Forbidden / Insufficient Role</td> </tr> <tr> <td>404</td> <td>Resource Not Found</td> </tr> <tr> <td>500</td> <td>Internal Server Error</td> </tr> </tbody></table><hr><h2>Test Credentials</h2><table class="e-rte-table"> <thead> <tr> <th>Role</th> <th>Email</th> <th>Password</th> </tr> </thead> <tbody><tr> <td>Admin</td> <td><a href="mailto:admin@tnbbms.gov.in">admin@tnbbms.gov.in</a></td> <td>admin123</td> </tr> <tr> <td>Hospital</td> <td><a href="mailto:ggh.chennai@tn.gov.in">ggh.chennai@tn.gov.in</a></td> <td>hospital123</td> </tr> <tr> <td>Blood Bank</td> <td><a href="mailto:chennai.bb@tnbbms.gov.in">chennai.bb@tnbbms.gov.in</a></td> <td>bloodbank123</td> </tr> <tr> <td>Donor</td> <td><a href="mailto:karthik@gmail.com">karthik@gmail.com</a></td> <td>donor123</td> </tr> </tbody></table><hr><h2>Districts (Tamil Nadu)</h2><p>Ariyalur, Chengalpattu, Chennai, Coimbatore, Cuddalore, Dharmapuri, Dindigul, Erode, Kallakurichi, Kanchipuram, Kanyakumari, Karur, Krishnagiri, Madurai, Mayiladuthurai, Nagapattinam, Namakkal, Nilgiris, Perambalur, Pudukkottai, Ramanathapuram, Ranipet, Salem, Sivagangai, Tenkasi, Thanjavur, Theni, Thoothukudi, Tiruchirappalli, Tirunelveli, Tirupathur, Tiruppur, Tiruvallur, Tiruvannamalai, Tiruvarur, Vellore, Viluppuram, Virudhunagar</p><hr><h2>Sample Dummy Data Summary</h2><table class="e-rte-table"> <thead> <tr> <th>Collection</th> <th>Count</th> <th>Details</th> </tr> </thead> <tbody><tr> <td>Users</td> <td>20</td> <td>1 admin + 4 hospital + 5 blood bank + 10 donor</td> </tr> <tr> <td>Donors</td> <td>10</td> <td>Across 10 districts, 8 blood groups</td> </tr> <tr> <td>Blood Banks</td> <td>5</td> <td>Chennai, Coimbatore, Madurai, Salem, Trichy</td> </tr> <tr> <td>Hospitals</td> <td>4</td> <td>Chennai, Madurai, Coimbatore, Tirunelveli</td> </tr> <tr> <td>Blood Requests</td> <td>6</td> <td>3 pending + 1 approved + 2 fulfilled</td> </tr> <tr> <td>Donation Camps</td> <td>4</td> <td>3 active + 1 completed</td> </tr> <tr> <td>Notifications</td> <td>5</td> <td>urgent, camp, info, general types</td> </tr> <tr> <td>Feedbacks</td> <td>6</td> <td>Ratings 3-5, various categories</td> </tr> </tbody></table><p>Run <code>npm run seed</code> to populate the database with sample data.</p>