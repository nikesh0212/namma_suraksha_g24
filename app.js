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
  const storage = firebase.storage();
  
  let map;
  let userMarker;
  
  // Google Maps Init
  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 12.9716, lng: 77.5946 },
      zoom: 12,
    });
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
  
        userMarker = new google.maps.Marker({
          position: pos,
          map: map,
          title: "You are here",
        });
  
      }, () => {
        alert("Error: Location access denied.");
      });
    }
  }
  
  // Make initMap global
  window.initMap = initMap;
  
  // Button Handler
  document.getElementById("alertButton").addEventListener("click", async () => {
    if (!userMarker) {
      alert("User location not found.");
      return;
    }
  
    const description = document.getElementById("description").value.trim();
    const videoFile = document.getElementById("video").files[0];
  
    if (!description) {
      alert("Please enter a problem description!");
      return;
    }
  
    const emergencyData = {
      latitude: userMarker.getPosition().lat(),
      longitude: userMarker.getPosition().lng(),
      timestamp: new Date(),
      status: "New Alert",
      description: description,
      videoUrl: null
    };
  
    try {
      if (videoFile) {
        // Upload video first
        const storageRef = storage.ref('videos/' + Date.now() + '_' + videoFile.name);
        const uploadTaskSnapshot = await storageRef.put(videoFile);
        const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();
        emergencyData.videoUrl = downloadURL;
      }
  
      await db.collection("emergencies").add(emergencyData);
      alert("🚨 Emergency Alert Sent!");
      document.getElementById("description").value = "";
      document.getElementById("video").value = "";
    } catch (error) {
      alert("Error sending alert: " + error.message);
    }
  });
  