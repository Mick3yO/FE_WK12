// Mock API
const apiUrl = 'https://658de4137c48dce94739d123.mockapi.io/applicants';

// Run code when the document is ready
$(document).ready(function() {
  // Load job applicants on page load
  loadApplicants();

  // Handle form submission for adding new job applicant
  $('#applicantForm').submit(function(event) {
    event.preventDefault();
    // Extract values from form inputs
    const name = $('#applicantName').val();
    const position = $('#applicantPosition').val();
    // Add a new job applicant
    addApplicant(name, position);
  });

  // Function to load job applicants from the API
  function loadApplicants() {
    $.get(apiUrl, function(applicants) {
      // Display the loaded job applicants in the UI
      displayApplicants(applicants);
    });
  }

  // Function to display job applicants in the UI
  function displayApplicants(applicants) {
    const applicantList = $('#applicantList');
    applicantList.empty();

    applicants.forEach(function(applicant) {
      // Create a list item for each applicant with edit and delete buttons
      const listItem = $('<li class="list-group-item">')
        .text(`${applicant.name} - ${applicant.position}`)
        .append(`<button class="btn btn-warning btn-sm float-right mr-2" onclick="editApplicant(${applicant.id})">Edit</button>`)
        .append(`<button class="btn btn-danger btn-sm float-right" onclick="deleteApplicant(${applicant.id})">Delete</button>`);
      applicantList.append(listItem);
    });
  }

  // Function to add a new job applicant
  function addApplicant(name, position) {
    $.post(apiUrl, { name: name, position: position }, function() {
      // Reload job applicants after adding a new one
      loadApplicants();
      // Reset the form
      $('#applicantForm')[0].reset();
    });
  }

  // Function to delete a job applicant
  window.deleteApplicant = function(id) {
    $.ajax({
      url: `${apiUrl}/${id}`,
      type: 'DELETE',
      success: function() {
        // Reload job applicants after deleting one
        loadApplicants();
      }
    });
  };

  // Function to edit a job applicant
  window.editApplicant = function(id) {
    // Fetch the details of the selected applicant
    $.get(`${apiUrl}/${id}`, function(applicant) {
      // Display an edit form for the applicant
      showEditForm(applicant);
    });
  };

  // Function to display an edit form for editing an applicant
  function showEditForm(applicant) {
    // Clear the applicant list
    const applicantList = $('#applicantList');
    applicantList.empty();

    // Create an edit form for the applicant
    const editForm = $('<form id="editApplicantForm">')
      .append(`<div class="form-group">
                  <label for="editApplicantName">Applicant Name:</label>
                  <input type="text" class="form-control" id="editApplicantName" value="${applicant.name}" required>
                </div>`)
      .append(`<div class="form-group">
                  <label for="editApplicantPosition">Position:</label>
                  <input type="text" class="form-control" id="editApplicantPosition" value="${applicant.position}" required>
                </div>`)
      .append(`<button type="button" class="btn btn-primary" onclick="saveEditedApplicant(${applicant.id})">Save changes</button>`);

    // Add the edit form to the page
    applicantList.append(editForm);
  }

  // Function to save changes after editing an applicant
  window.saveEditedApplicant = function(id) {
    // Extract values from the edit form inputs
    const editedName = $('#editApplicantName').val();
    const editedPosition = $('#editApplicantPosition').val();

    // Fetch the existing data for the specific applicant
    $.get(`${apiUrl}/${id}`, function(existingApplicant) {
      // Update only the properties that were edited. I was having an issue where other prerties in the API were being updated as well.//
      const updatedApplicant = {
        name: editedName || existingApplicant.name,
        position: editedPosition || existingApplicant.position,
      };

      // Update the applicant with the edited data
      $.ajax({
        url: `${apiUrl}/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedApplicant),
        success: function() {
          // Reload job applicants after editing
          loadApplicants();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error updating applicant:', textStatus, errorThrown);
        }
      });
    });
  };
});
