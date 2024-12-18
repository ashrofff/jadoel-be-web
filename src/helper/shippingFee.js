function hitungJarak(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius bumi dalam kilometer
  const radLat1 = (Math.PI / 180) * lat1;
  const radLat2 = (Math.PI / 180) * lat2;
  const deltaLat = (Math.PI / 180) * (lat2 - lat1);
  const deltaLon = (Math.PI / 180) * (lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Jarak dalam kilometer
}

function hitungOngkir(lat1, lon1, lat2, lon2, tarifPerKm) {
  const jarak = hitungJarak(lat1, lon1, lat2, lon2);
  const tarifDasar = 10000; // Tarif dasar untuk jarak hingga 5 km
  const batasJarakDasar = 5; // Jarak batas untuk tarif dasar

  let totalOngkir;

  if (jarak <= batasJarakDasar) {
    totalOngkir = tarifDasar; // Tarif tetap untuk jarak <= 5 km
  } else {
    const jarakLebih = jarak - batasJarakDasar;
    totalOngkir = tarifDasar + jarakLebih * tarifPerKm;
  }

  return Math.round(totalOngkir); // Pembulatan ke bilangan terdekat
}


export default hitungOngkir;
