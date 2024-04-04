document.addEventListener("DOMContentLoaded", function() {
    const dogForm = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');

    // Function to fetch and render dog data
    function fetchAndRenderDogs() {
        fetch('http://localhost:3000/dogs')
            .then(response => response.json())
            .then(data => {
                tableBody.innerHTML = ''; // Clear previous dog list
                data.forEach(dog => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${dog.name}</td>
                        <td>${dog.breed}</td>
                        <td>${dog.sex}</td>
                        <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching dogs:', error);
            });
    }

    // Initial rendering of dog data
    fetchAndRenderDogs();

    // Event listener for form submission
    dogForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(dogForm);
        const newDog = {
            name: formData.get('name'),
            breed: formData.get('breed'),
            sex: formData.get('sex')
        };
        fetch('http://localhost:3000/dogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newDog)
        })
        .then(response => response.json())
        .then(() => {
            // Fetch and re-render dogs after successful submission
            fetchAndRenderDogs();
            dogForm.reset(); // Reset form after submission
        })
        .catch(error => {
            console.error('Error adding new dog:', error);
        });
    });

    // Event listener for edit button clicks
    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-btn')) {
            const dogId = event.target.dataset.id;
            fetch(`http://localhost:3000/dogs/${dogId}`)
                .then(response => response.json())
                .then(dog => {
                    // Populate form with dog data
                    dogForm.elements['name'].value = dog.name;
                    dogForm.elements['breed'].value = dog.breed;
                    dogForm.elements['sex'].value = dog.sex;
                    dogForm.dataset.id = dog.id; // Store dog id in form's dataset
                })
                .catch(error => {
                    console.error('Error fetching dog:', error);
                });
        }
    });
});
