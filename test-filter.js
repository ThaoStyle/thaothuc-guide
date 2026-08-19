// Mock data and functions
let allLocs = [
  { id: '1', name: 'A', badge_type: 'spot' },
  { id: '2', name: 'B', badge_type: 'approved' }
];

function isFav(id) {
  return id === '1'; // Mock id '1' is favorited
}

function filterMap(f) {
  var filtered = [];
  if(f==='fav') {
    filtered = allLocs.filter(function(l) { return isFav(l.id); });
  }else if(f==='all'){
    filtered = allLocs;
  }
  return filtered;
}

console.log('Fav filter result:', filterMap('fav'));
