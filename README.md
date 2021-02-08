# strapi-provider-email-multi

A strapi email provider that allows multiple "email channels", each sending via a different provider.

## Example

```
// config/plugins.js

module.exports = ({ env }) => {
  const providers = {
    console: {},

    mailtrap: {
      user: env('MAILTRAP_USER'),
      password: env('MAILTRAP_PASSWORD')
    },

    sendgrid: {
      apiKey: env('SENDGRID_API_KEY')
    }
  }

  return {
    email: {
      provider: 'multi',
      providerOptions: {
        // Default provider to use if no valid channel is found.
        default: 'console',

        // The multi provider needs to know how to initialize other providers.
        init: {
          console: require('strapi-email-provider-console').init,
          mailtrap: require('strapi-email-provider-mailtrap').init,
          sendgrid: require('strapi-email-provider-sendgrid').init
        },
        
        // Define channels for different kinds of emails.
        channels: {
          // Account emails: forgot-password, etc.
          account: 'sendgrid',

          // Newsletter emails: in some environments we want these send via sendgrid,
          // but in others we will send them to the console.
          newsletter: env('NEWSLETTER_EMAIL_CHANNEL'),

          // QA: when we need a visual review on an email.
          qa: 'mailtrap'
        }
      }
    }
  }
}
```
