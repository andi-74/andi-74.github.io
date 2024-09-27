// fetch('elements/navbar.html')
//     .then(response => response.text())
//     .then(data => {
//         document.getElementById('navbar-container').innerHTML = data;
//     }
// );

window.smoothScroll = function(target) {
    var scrollContainer = target;
    do { //find scroll container
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    var targetY = 0;
    do { //find the top of target relatively to the container
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);

    scroll = function(c, a, b, i) {
        i++; if (i > 30) return;
        c.scrollTop = a + (b - a) / 30 * i;
        setTimeout(function(){ scroll(c, a, b, i); }, 20);
    }
    // start scrolling
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
}

document.getElementById("date-today").value = new Date().toISOString().substring(0, 10);;

// Get all select elements with the 'placeholder' class
const selectElements = document.querySelectorAll('select[class*="placeholder"]');

selectElements.forEach(function(selectElement) {
    // Add change event listener to each select element
    selectElement.addEventListener('change', function() {
        const firstOption = this.options[0]; // Get the first option

        if (this.value === firstOption.value) {
            this.style.color = 'grey'; // Set color to grey if first option is selected
        } else {
            this.style.color = 'black'; // Otherwise, set color to black
        }
    });

    // Set initial color for when the page loads
    const firstOption = selectElement.options[0];
    if (selectElement.value === firstOption.value) {
        selectElement.style.color = 'grey';
    } else {
        selectElement.style.color = 'black';
    }
});

/* FORM BUTTON AND STEP VISIBILITY */

document.addEventListener('DOMContentLoaded', function() {
    let thisStep = 1;
    const formSteps = document.querySelectorAll('.form-step');
    const allSteps = formSteps.length;

    const checkbox = document.getElementById('raidalt');
    const raidAlts = document.querySelectorAll('.raid-alt');

    const submitButton = document.getElementById('submit');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    // Function to toggle the visibility of buttons based on the checkbox state and step number
    function updateForm() {
        const isChecked = checkbox.checked;

        if (!isChecked) {
            // If checkbox is unchecked, only show the submit button
            submitButton.classList.remove('hidden');
            prevButton.classList.add('hidden');
            nextButton.classList.add('hidden');
        } else {
            // Checkbox is checked, show buttons based on the step
            if (thisStep === allSteps) {
                submitButton.classList.remove('hidden');  // Visible on last step when checked
            } else {
                submitButton.classList.add('hidden');     // Hidden on other steps
            }

            // Prev and next button visibility
            prevButton.classList.toggle('hidden', thisStep === 1);
            nextButton.classList.toggle('hidden', thisStep === allSteps);
        }

        raidAlts.forEach(function(input) {
            if (checkbox.checked) {
                input.setAttribute('required', true); // Make inputs required
            } else {
                input.removeAttribute('required'); // Remove required attribute
            }
        });
    }

    // Function to show the current step and update button visibility
    function showStep() {
        formSteps.forEach((step, index) => {
            step.classList.toggle('hidden', index + 1 !== thisStep);
        });

        updateForm();
    }

    // Add event listener for checkbox change to update button visibility
    checkbox.addEventListener('change', updateForm);

    // Add event listeners for the "next" and "prev" buttons
    nextButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (thisStep < allSteps) {
            thisStep++;
            showStep();
        }
    });

    prevButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (thisStep > 1) {
            thisStep--;
            showStep();
        }
    });

    submitButton.addEventListener('click', function(e) {
        e.preventDefault();

        const form = document.getElementById('raidform');
        const formData = new FormData(form);

        if (form.checkValidity()) {

            const formSpinner = document.getElementById('raidspinner');
            formSpinner.classList.remove('hidden');
            
            // Disable form while processing
            const formElements = form.elements;
            for (let i = 0; i < formElements.length; i++) {
                formElements[i].disabled = true;
            }

            // Submit form data
            const formAction = 'https://flukegaming.azurewebsites.net/raidsignup.php';
            fetch(formAction, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                // Check if the response content type is JSON
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json(); // Parse JSON if content type is application/json
                } else {
                    throw new Error('Expected JSON response but got ' + contentType);
                }
            })
            .then(data => {
                console.log('Response data:', data); // Debugging output
                if (data.status === 201) {
                    // Success
                    document.getElementById('success').classList.remove('hidden');
                } else if (data.status === 400) {
                    // Missing data
                    document.getElementById('missing').classList.remove('hidden');
                } else {
                    // Failure
                    document.getElementById('fail').classList.remove('hidden');
                }
            })
            .catch(error => {
                console.error('Error:', error); // Debugging output
                document.getElementById('error').classList.remove('hidden');
            })
            .finally(() => {
                console.log('Finally block executed'); // Debugging output
                // Re-enable all form elements
                for (let i = 0; i < formElements.length; i++) {
                    formElements[i].disabled = false;
                }
        
                formSpinner.classList.add('hidden');
            });
        } else {
            form.reportValidity();
        }
    });

    // Initial setup: show the first step and update button visibility
    showStep();
});


function closeDiv(element) {
    document.getElementById(element).classList.add('hidden');
}