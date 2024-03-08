/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (sessionStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            sessionStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
});
//  window.addEventListener('DOMContentLoaded', () => {
//         const sidebarToggle = document.querySelector('#sidebarToggle');
//         const sidenav = document.querySelector('#layoutSidenav');
//         const content = document.querySelector('#layoutSidenav_content');
        
//         if (sidebarToggle) {
//             sidebarToggle.addEventListener('click', () => {
//                 sidenav.classList.toggle('open');
//                 content.classList.toggle('pushed');
//             });
//         }
//     });