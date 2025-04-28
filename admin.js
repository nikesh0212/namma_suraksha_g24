// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDV2X8N1iN0EfbG6XBh4NYE95syHdLi5k4",
    authDomain: "safesightapp.firebaseapp.com",
    projectId: "safesightapp",
    storageBucket: "safesightapp.appspot.com",
    messagingSenderId: "476899350289",
    appId: "1:476899350289:web:4f648986aaa13183895eb0",
    measurementId: "G-8DPZG95K02"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  let map;
  
  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 12.9716, lng: 77.5946 },
      zoom: 12,
    });
  
    fetchAlerts();
  }
  
  window.initMap = initMap;
  
  function fetchAlerts() {
    db.collection("emergencies").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      const alertsPanel = document.getElementById("alertsPanel");
      alertsPanel.innerHTML = "<h2>📢 Received Alerts</h2>";
  
      snapshot.forEach((doc) => {
        const data = doc.data();
  
        // Add marker
        const marker = new google.maps.Marker({
          position: { lat: data.latitude, lng: data.longitude },
          map: map,
          title: data.description || "Emergency Alert"
        });
  
        // Show in side panel
        const card = document.createElement("div");
        card.className = "alert-card";
        card.innerHTML = `
          <h3>${data.description || "Emergency Alert"}</h3>
          <p><strong>Status:</strong> ${data.status}</p>
          <p><strong>Time:</strong> ${new Date(data.timestamp.seconds * 1000).toLocaleString()}</p>
          <button onclick="focusLocation(${data.latitude}, ${data.longitude})">📍 View Location</button>
          ${data.videoUrl ? `<button onclick="viewVideo('${data.videoUrl}')">🎥 View Video</button>` : ''}
        `;
  
        alertsPanel.appendChild(card);
      });
    });
  }
  
  function focusLocation(lat, lng) {
    map.setCenter({ lat, lng });
    map.setZoom(16);
  }
  
  function viewVideo(videoUrl) {
    window.open(videoUrl, "_blank");
  }
  