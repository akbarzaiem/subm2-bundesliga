const api_key = '2b8c09ef7989421194820640de822890';
const league_id = 2002;
var base_url = "https://api.football-data.org/v2/";
var teams_url = `${base_url}competitions/${league_id}/teams`;
var klasemen_url = `${base_url}competitions/${league_id}/standings`;
var teamData;


var fetchApi = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': api_key
    }
  });
}

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}


function getKlasemen() {
  if ('caches' in window) {
    caches.match(klasemen_url).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          klasemenHtml(data);

        });
      }
    });
  }

  fetchApi(klasemen_url)
    .then(status)
    .then(json)
    .then(function (data) {
      klasemenHtml(data)
    })
    .catch(error);
}

function klasemenHtml(data) {
  var html = '';
  var content = '';


  var str = JSON.stringify(data).replace(/http:/g, 'https:');
  data = JSON.parse(str);


  content = `<span class="card-title" align="center" style ="font-weight: bold;"><img src="./image/bundes-logo.png" alt="logo" height="100"></img> </span>
    `;
  data.standings[0].table.forEach(function (team) {
    html += `<tr>
     <td>${team.position}</td>
     <td><img class="responsive-img" alt="tim" width="20" height="20" src="${team.team.crestUrl}"> ${team.team.name}</td>
     <td>${team.playedGames}</td>
     <td>${team.won}</td>
     <td>${team.draw}</td>
     <td>${team.lost}</td>
     <td>${team.goalsFor}</td>
     <td>${team.goalsAgainst}</td>
     <td>${team.goalDifference}</td>
     <td>${team.points}</td>
     </tr>
   `;
  })
  document.getElementById("preloader").innerHTML = '';
  document.getElementById("standing").innerHTML = html;
  document.getElementById("standingCard").innerHTML = content;

}

var getTeams = () => {
  return fetchApi(teams_url)
    .then(status)
    .then(json);
}


var getAllTeams = () => {
  var teams = getTeams()
  teams.then(data => {
    var str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);
    teamData = data;
    var html = ''
    html += ''
    data.teams.forEach(team => {
      html += `
             <div class="collection-item"> 
    
                   <div class="center"><img width="50" height="50" alt="tim" src="${team.crestUrl}"></div>
                   <div class="center"><b>${team.name}</b> </div>
                   <div class="card-action center">
                   <a class="waves-effect waves-light btn blue" onclick="tambahTeamListener(${team.id})"><img src="/image/star.png" alt="st" height="15px"> Tambah ke Favorit</a>
                   </div>
            </div>
            </div>
        `
    })
    document.getElementById("preloader").innerHTML = '';
    document.getElementById("teams").innerHTML = html;
  })
}

function getFavoriteTeams() {
  var dataDB = getFavTeams();
  dataDB.then(function (data) {
    var html = '';
    data.forEach(function (team) {

      html += `
     <div class="collection-item"> 
     <div class="center"><img width="50" height="50" alt="tim" src="${team.crestUrl}"></div>
     <div class="center"><b>${team.name} </b></div>
     <div class="center">${team.area.name}</div>
     <div class="center">Tahun berdiri : ${team.founded}</div>
     <div class="center">Alamat : ${team.address}</div>
     <div class="center">Telepon : ${team.phone} </div>
     <div class="center">Email : ${team.email}</div>
     <div class="center">Warna Jersey : ${team.clubColors}</div>
     <div class="center">Stadion : ${team.venue}</div>
     <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
     <div class="card-action center">
     <a class="waves-effect waves-light btn red" onclick="hapusTeamListener(${team.id})"><i class="material-icons right"></i><img src="/image/star.png" alt="st" height="15px"> Hapus dari Favorit</a>
     </div>
     
 </div>
 </div>
 `;
    });
    if (data.length == 0) html += '<h5 class="center-align">Tidak ada tim favorit yang disimpan!</5>'
    document.getElementById("preloader").innerHTML = html;
    document.getElementById("fav-teams").innerHTML = html;
  });

}

var dbPromise = idb.open('bundesliga', 1, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('teams', { 'keyPath': 'id' })
  }
});

function tambahTeam(team) {
  const title = 'Data disimpan';
  const options = {
    'body': 'Menyimpan data tim yang dipilih ke menu favorit ',
    'badge': './image/bundes-logo.png',
    'icon': './image/bundes-logo.png'
  };
  dbPromise.then(function (db) {
    var tx = db.transaction('teams', 'readwrite');
    var store = tx.objectStore('teams')
    store.put(team)
    return tx.complete;
  }).then(function () {
    M.toast({ html: `${team.name} berhasil ditambahkan ke favorit!` });
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification(title, options);
      });
    } else {
      console.error('Fitur notifikasi tidak diijinkan.');
    }
  })
}

function hapusTeam(teamId) {
  const title = 'Data dihapus';
  const options = {
    'body': 'Menghapus data tim yang dipilih dari menu favorit ',
    'badge': './image/bundes-logo.png',
    'icon': './image/bundes-logo.png'
  };
  dbPromise.then(function (db) {
    var tx = db.transaction('teams', 'readwrite');
    var store = tx.objectStore('teams');
    store.delete(teamId);
    return tx.complete;

  }).then(function () {
    M.toast({ html: 'Berhasil di hapus!' });
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification(title, options);
      });
    } else {
      console.error('Fitur notifikasi tidak diijinkan.');
    }
    getFavoriteTeams();
  }).catch(err => {
    console.error('Error: ', err);
  });
}

function getFavTeams() {
  return dbPromise.then(function (db) {
    var tx = db.transaction('teams', 'readonly');
    var store = tx.objectStore('teams');
    return store.getAll();
  })
}

var tambahTeamListener = teamId => {
  var team = teamData.teams.filter(el => el.id == teamId)[0]
  tambahTeam(team);
  console.log(teamId + "ditambahkan ke favorit")//console
}

var hapusTeamListener = teamId => {
  var confirmation = confirm("Hapus tim ini?")
  if (confirmation == true) {
    hapusTeam(teamId);
    console.log(teamId + "telah dihapus")//console
  }
}






