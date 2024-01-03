// Rekisteröityminen    
function displaySignupMessage(message, type) {
    $('#signupMessage').html('<div class="alert alert-' + type + '">' + message + '</div>');
    $('#signinMessage').hide();
    $('#signupMessage').show();
}
$('#signupBtn').on('click', function () {
    signUp();
});

// Sisäänkirjautuminen
function displaySigninMessage(message, type) {
    $('#signinMessage').html('<div class="alert alert-' + type + '">' + message + '</div>');
    $('#signupMessage').hide();
    $('#signinMessage').show();
    $('#signupBtn').hide();
    $('#loginBtn').hide();
    $('#logoutBtn').show();
}

$('#loginBtn').on('click', function () {
    signIn();
});

//Ulosirjautuminen
function logOut() {
    $('#signupBtn').show();
    $('#loginBtn').show();
    $('#logoutBtn').hide();
    $('#signinMessage').hide();
};

$('#logoutBtn').on('click', function () {
    logOut();
});

//Tietojen tallentaminen muokkauksen ja uuden käyttäjän luomisen jälkeen
$('#saveChangesBtn').on('click', function () {
    var editedEmail = $('#editEmail').val();
    var editedFirstName = $('#editFirstName').val();
    var editedLastName = $('#editLastName').val();
    console.log("Edited Email:", editedEmail);
    console.log("Edited First Name:", editedFirstName);
    console.log("Edited Last Name:", editedLastName);

    var successMessage = 'Operation succeeded! Server response: {"email":"' + editedEmail + '", "first-name":"' + editedFirstName + '", "last-name":"' + editedLastName + '", "id":1, "time":"' + new Date().toLocaleString() + '"}';
    $('#saveChanges').html(successMessage);
    $('#saveChanges').show();
    $('#myModal').modal('hide');

    setTimeout(function () {
        $('#saveChanges').hide();
    }, 3000);
});

// Modaali otsikko ja nollataan kentät
function setModalContent(title) {
    $('#myModal .modal-title').text(title);
    $('#editEmail').val('');
    $('#editFirstName').val('');
    $('#editLastName').val('');
}

$('#createBtn').on('click', function () {
    setModalContent('Create User');
    $('#myModal').modal('show');
});

$('#user-info').on('click', '.editBtn', function () {
    var userId = $(this).closest('tr').find('.deleteBtn').data('userid');
    $.get(`https://reqres.in/api/users/${userId}`, function (response) {
        var user = response.data;
        $('#editEmail').val(user.email);
        $('#editFirstName').val(user.first_name);
        $('#editLastName').val(user.last_name);

        setModalContent('Edit User');
        $('#myModal').modal('show');
    })
        .fail(function () {
            console.error("Error fetching user data:", error);
            alert("Käyttäjän tietoja ei voitu noutaa.");
        });
});

// Henkilön poistaminen
$('#user-info').on('click', '.deleteBtn', function () {
    var deleteButton = $(this);
    var userId = deleteButton.data('userid');
    $.ajax({
        url: `https://reqres.in/api/users/${userId}`,
        type: 'DELETE',
        success: function (response) {
            console.log('User deleted successfully:', response);
            deleteButton.closest('tr').remove();
        },
        error: function (error) {
            console.error('Error deleting user:', error);

        }
    });
});

//Ladataan käyttäjät takaisin Load Users -painikkeesta
$('#loadUsersBtn').on('click', function () {
    var page = 1;
    $("#user-info").empty();
    var ajaxRequests = [];

    for (let i = 1; i <= 6; i++) {
        ajaxRequests.push($.get(`https://reqres.in/api/users/${i}`));
    }

    Promise.all(ajaxRequests)
        .then(responses => {
            responses.forEach(response => {
                let user = response.data;
                let row = `
                    <tr>
                        <td>${user.id}</td>
                        <td><img src="${user.avatar}" alt="user avatar" class="rounded-avatar"></td>
                        <td>${user.email}</td>
                        <td>${user.first_name}</td>
                        <td>${user.last_name}</td>
                        <td><button type="button" class="btn btn-info editBtn">Edit</button>
                            <button type="button" class="btn btn-danger deleteBtn" data-userid="${user.id}">Delete</button></td>
                    </tr>
                `;
                $("#user-info").append(row);
            });
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            $("#user-info").append("<tr><td colspan='6'>Käyttäjän haku ei onnistunut.</td></tr>");
        });
});






