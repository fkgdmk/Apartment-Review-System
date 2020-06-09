

export function registerSW() {
    if ('serviceWorker' in navigator) {
    console.log("test")
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => console.log("SERVICE WORKER REGISTERED"))
        .catch(err => console.log("SERVICE WORKER REGISTRATION ERROR", err))
    });
  }
}







