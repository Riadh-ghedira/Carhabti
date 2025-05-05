

document.addEventListener('DOMContentLoaded', () => {
    const reservationsDisplay = document.getElementById('reservations-display');
    const historiqueDisplay = document.getElementById('historique-display');
    const email = localStorage.getItem('email') || "";
    const isAdmin = localStorage.getItem('isAdmin') === "true";
    const reservationBtn = document.getElementById('reservations');
    const historyBtn = document.getElementById('historique');

    const callAlertBox = (msg, type = 'success') => {
        console.log(`Alert: ${msg} (type: ${type})`);
        const alertBox = document.createElement('div');
        alertBox.classList.add('alert-box', type);
        alertBox.innerHTML = `
          <div class="icon"><i class="fa-solid ${type === 'error' ? 'fa-times-circle' : 'fa-check-circle'}"></i></div>
          <div class="msg"><p>${msg}</p></div>
        `;
        document.body.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 3000);
    };
    const deleteUser = (email) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${email} ?`)) {
            fetch('/carhabti/CARHABTI/build/php/reservations.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        callAlertBox('Utilisateur supprimé avec succès');
                        setTimeout(() => {
                            displayUsers(); 
                        }, 300); 
                    } else {
                        callAlertBox(data.message || 'Échec de la suppression de l\'utilisateur', 'error');
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
                    callAlertBox('Erreur lors de la suppression de l\'utilisateur', 'error');
                });
        }
    };
    
    const changeAdmin = (email) => {
        if (confirm(`Êtes-vous sûr de changer la badge Admin de l'utilisateur ${email} ?`)) {
            fetch('/carhabti/CARHABTI/build/php/reservations.php', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, toggleAdmin: true })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        callAlertBox(`Admin status updated for ${email}`);
                        setTimeout(() => {
                            displayUsers(); 
                        }, 300);
                    } else {
                        callAlertBox(data.message || 'Failed to update admin status', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error updating admin status:', error);
                    callAlertBox('Error updating admin status', 'error');
                });
        }
    };
    
    const Reservation = (id) => {
        localStorage.setItem('selectedCarId', id);
        window.location.href = '../CARHABTI/reservation.html';
    };
    const reservationLine = (data) => {
        const tr = document.createElement('tr');
        const fields = [
            'id', 'car_id', 'car_name', 'email', 'name', 'phone', 'address', 'message',
            'pickup_agence', 'pickup_date', 'pickup_time', 'return_agence',
            'return_date', 'return_time', 'created_at'
        ];

        fields.forEach(field => {
            const td = document.createElement('td');
            if (field === 'id') {
                td.innerHTML = `<a class="view-reservation" data-id="${data['id']}"><i class="fa-solid fa-image"></i></a>`;
            } else {
                td.textContent = data[field] || '';
            }
            tr.appendChild(td);
        });

        return tr;
    };

    const userLine = (data) => {
        const tr = document.createElement('tr');
        const fields = [
            'Supprimer', 'email', 'name', 'phone', 'address', 'birth',
            'cin', 'licence', 'admin', 'Change-admin-badge'
        ];

        fields.forEach(field => {
            const td = document.createElement('td');
            if (field === 'Supprimer') {
                td.innerHTML = `<a class="delete-user" data-email="${data['email']}"><i class="fa-solid fa-trash"></i></a>`;
            } else if (field === 'Change-admin-badge') {
                td.innerHTML = `<a class="change-admin" data-email="${data['email']}">${data['admin'] ? '<i class="fa-solid fa-minus"></i>' : '<i class="fa-solid fa-plus"></i>'}</a>`;
            } else {
                td.textContent = field === 'admin' ? (data[field] === 1 || data[field] === '1' ? 'Yes' : 'No') : data[field] || '';
            }
            tr.appendChild(td);
        });

        return tr;
    };

    const displayReservations = () => {
        reservationsDisplay.innerHTML = `
            <h2>Mes Réservations</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Voir voiture</th>
                            <th>Id voiture</th>
                            <th>Nom voiture</th>
                            <th>Email</th>
                            <th>Nom</th>
                            <th>Tel</th>
                            <th>Adresse</th>
                            <th>Msg</th>
                            <th>Agence de p.e.c</th>
                            <th>Date de p.e.c</th>
                            <th>Heure de p.e.c</th>
                            <th>Agence de retour</th>
                            <th>Date de retour</th>
                            <th>Heure de retour</th>
                            <th>Réservé en</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
        return reservationsDisplay.querySelector('tbody');
    };

    const displayHistorique = () => {
        historiqueDisplay.innerHTML = `
            <h2>Historique</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Voir voiture</th>
                            <th>Id voiture</th>
                            <th>Nom voiture</th>
                            <th>Email</th>
                            <th>Nom</th>
                            <th>Tel</th>
                            <th>Adresse</th>
                            <th>Msg</th>
                            <th>Agence de p.e.c</th>
                            <th>Date de p.e.c</th>
                            <th>Heure de p.e.c</th>
                            <th>Agence de retour</th>
                            <th>Date de retour</th>
                            <th>Heure de retour</th>
                            <th>Réservé en</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
        return historiqueDisplay.querySelector('tbody');
    };

    const displayUsers = () => {
        historiqueDisplay.innerHTML = `
            <h2>Utilisateurs</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Supprimer</th>
                            <th>Email</th>
                            <th>Nom</th>
                            <th>Tel</th>
                            <th>Adresse</th>
                            <th>Date de naissance</th>
                            <th>CIN</th>
                            <th>Licence</th>
                            <th>Admin</th>
                            <th>Changer badge admin</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
        
        const usersTable = historiqueDisplay.querySelector('tbody');
        console.log('Fetching users for admin...');
        fetch('/carhabti/CARHABTI/build/php/reservations.php?users=true')
            .then(response => {
                console.log('Users fetch response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Users data received:', data);
                if (!data.success || !data.users || data.users.length === 0) {
                    usersTable.innerHTML = '<tr><td colspan="10">No users found</td></tr>';
                } else {
                    data.users.forEach(user => {
                        usersTable.appendChild(userLine(user));
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                usersTable.innerHTML = '<tr><td colspan="10">Could not load users: ' + error.message + '</td></tr>';
            });
    };

    const setupEventListeners = () => {
        
        reservationsDisplay.addEventListener('click', (event) => {
            const target = event.target.closest('a');
            if (!target) return;

            if (target.classList.contains('view-reservation')) {
                const id = target.dataset.id;
                Reservation(id);
            }
        });

        
        historiqueDisplay.addEventListener('click', (event) => {
            const target = event.target.closest('a');
            if (!target) return;

            if (target.classList.contains('delete-user')) {
                const email = target.dataset.email;
                deleteUser(email);
            } else if (target.classList.contains('change-admin')) {
                const email = target.dataset.email;
                changeAdmin(email);
            }else if (target.classList.contains('view-reservation')) {
                const id = target.dataset.id;
                Reservation(id);
            }
        });
    };

    if (email === "") {
        console.log('No email found in localStorage');
        callAlertBox("Couldn't find email", 'error');
        const reservations = displayReservations();
        const historique = displayHistorique();
        reservations.innerHTML = '<tr><td colspan="14">Please log in to view reservations</td></tr>';
        historique.innerHTML = '<tr><td colspan="14">Please log in to view history</td></tr>';
        return;
    }

    console.log('Email:', email, 'isAdmin:', isAdmin);

    if (isAdmin) {
        historyBtn.innerHTML = `
            <i class="fa-solid fa-users"></i>
            <h3>Utilisateurs</h3>
            <i class="fa-solid fa-angle-right right"></i>
        `;
        reservationBtn.innerHTML = `
            <i class="fa-solid fa-car"></i>
            <h3>Réservations</h3>
            <i class="fa-solid fa-angle-right right"></i>
        `;
        displayUsers();
    } else {
        displayHistorique();
    }

    const reservations = displayReservations();
    const apiUrl = isAdmin 
        ? `/carhabti/CARHABTI/build/php/reservations.php?allReservations=true` 
        : `/carhabti/CARHABTI/build/php/reservations.php?email=${encodeURIComponent(email)}`;
    console.log('Fetching reservations from:', apiUrl);

    fetch(apiUrl)
        .then(response => {
            console.log('Reservations fetch response status:', response.status);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Reservations data received:', data);
            if (!data.success || !data.array || data.array.length === 0) {
                reservations.innerHTML = '<tr><td colspan="14">No active reservations</td></tr>';
                if (!isAdmin) {
                    const historique = historiqueDisplay.querySelector('tbody');
                    historique.innerHTML = '<tr><td colspan="14">No reservation history</td></tr>';
                }
            } else {
                reservations.innerHTML = '';
                if (!isAdmin) {
                    const historique = historiqueDisplay.querySelector('tbody');
                    historique.innerHTML = '';
                }
                data.array.forEach(reservation => {
                    const currentDate = new Date().toISOString().split('T')[0];
                    console.log(currentDate);
                    if (isAdmin) { 
                        reservations.appendChild(reservationLine(reservation));
                    } else {
                        if (reservation.return_date >= currentDate) {
                            reservations.appendChild(reservationLine(reservation));
                        } else if (!isAdmin) {
                            const historique = historiqueDisplay.querySelector('tbody');
                            historique.appendChild(reservationLine(reservation));
                        }
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching reservations:', error);
            reservations.innerHTML = '<tr><td colspan="14">Could not load reservations: ' + error.message + '</td></tr>';
            if (!isAdmin) {
                const historique = historiqueDisplay.querySelector('tbody');
                historique.innerHTML = '<tr><td colspan="14">Could not load reservation history: ' + error.message + '</td></tr>';
            }
        });

    setupEventListeners(); 
});