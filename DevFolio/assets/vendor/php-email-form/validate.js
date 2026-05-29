/**
* PHP Email Form Validation - v3.11
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading')?.classList.add('d-block');
      thisForm.querySelector('.error-message')?.classList.remove('d-block');
      thisForm.querySelector('.sent-message')?.classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    const isWeb3Forms = action.includes('api.web3forms.com/submit');

    if (isWeb3Forms && !formData.get('access_key')) {
      displayError(thisForm, 'Web3Forms access key is missing. Set the access_key value in index.html.');
      return;
    }

    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
      if( response.ok ) {
        return isWeb3Forms ? response.json() : response.text();
      } else {
        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');

      if (isWeb3Forms) {
        if (data.success === true) {
          showSuccess(thisForm);
          return;
        }

        throw new Error(data.message || 'Form submission failed.');
      }

      if (data.trim() == 'OK') {
        showSuccess(thisForm);
      } else {
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }

  function showSuccess(thisForm) {
    thisForm.reset();
    thisForm.style.display = 'none';

    const successPanel = thisForm.closest('.container, .contact-wrapper, div')
      .querySelector('.contact-success-panel');

    if (successPanel) {
      successPanel.style.display = 'block';

      const btn = successPanel.querySelector('.btn-send-another');
      if (btn) {
        btn.addEventListener('click', function onReset() {
          successPanel.style.display = 'none';
          thisForm.style.display = '';
          btn.removeEventListener('click', onReset);
        }, { once: true });
      }
    }
  }

  function displayError(thisForm, error) {
    let errorText = error;
    if (error instanceof TypeError || String(error).toLowerCase().includes('failed to fetch')) {
      errorText = 'Unable to submit the form. Check your internet connection and verify the form action endpoint and access key.';
    }

    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = errorText;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
