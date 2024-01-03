function signUp() {
    $.post('https://reqres.in/api/register', { email: 'eve.holt@reqres.in', password: 'pistol' })
        .done(function(response) {
            console.log('Registration successfull!:', response);
            displaySignupMessage('Registration successfull!\nStatus: ' + '200' + '\nToken: ' + response.token);
        })
        .fail(function(error) {
            console.error('Registration failed:', error);
            displaySignupMessage('Registration failed');
        });
}

function signIn() {
    $.post('https://reqres.in/api/login', { email: 'eve.holt@reqres.in', password: 'pistol' })
       .done(function(response) {
       console.log('You are logged in as user:', response);
       displaySigninMessage('You are logged in as user: ' + 'eve.holt@reqres.in');
    })
   .fail(function(error) {
       console.error('Signing in failed:', error);
       displaySigninMessage('Signing in failed', 'danger');
    });
}

$('#user-info').on('click', '.editBtn', function () {
    var userId = $(this).closest('tr').find('.deleteBtn').data('userid');
    $.get(`https://reqres.in/api/users/${userId}`, function (response) {
        var user = response.data;
        $('#editEmail').val(user.email);
        $('#editFirstName').val(user.first_name);
        $('#editLastName').val(user.last_name);

        $('#saveChangesBtn').on('click', function () {
            var editedEmail = $('#editEmail').val();
            var editedFirstName = $('#editFirstName').val();
            var editedLastName = $('#editLastName').val();

           $('#myModal').modal('hide');
        });

        $('#myModal').modal('show');
    })
    .fail(function () {
        console.error("Error fetching user data:", error);
        alert("Käyttäjän tietoja ei voitu noutaa.");
    });
});

//Käyttäjien hakeminen taulukkoon
$(document).ready(function(){
    function loadUsers(page) {
        $("#user-info").empty();
        var startId = (page - 1) * 6 + 1;
        var endId = startId + 5;

        for (let i = startId; i <= endId; i++){
            $.get(`https://reqres.in/api/users/${i}`, function(response){
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
            })
            .fail(function(){
                $("#user-info").append("<tr><td colspan='6'>Käyttäjän haku ei onnistunut.</td></tr>"); 
            });
        }
    }   
        loadUsers(1);

        $(".page-button").on("click", function () {
            var page = $(this).data("page");
            loadUsers(page);
        });            
    });


