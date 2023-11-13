## Sendgrid (Email shared library) 

when imported into the project provides a 
SendGrid client to any class that injects it. This lets SendGrid be worked into 
your dependency injection workflow without having to do any extra work outside the initial setup.

####Sending an email (no template)

```typescript
 const msg = {
     to: data.email,
     from: "no-reply@ourherd.io", 
     subject: "Welcome",
     text: `verification code:${randomCode}`,
     html: `<strong>verification code:${randomCode}</strong>`,
};

this.sendgridService.send(msg).subscribe({
     next: data => console.log(`${data}`),
     error: error => console.log(`${error}`)
});
```

####Sending an email (with template)

All credentials are in 1Password and to **Create a template on Sendgrid**, please go here 
[create-and-edit-legacy-transactional-templates] 
{https://docs.sendgrid.com/ui/sending-email/create-and-edit-legacy-transactional-templates}

```typescript
const msg = {
  from: "no-reply@ourherd.io",
  subject: 'Welcome to Ourherd',
  templateId: "d-cc6080999ac04a558d632acf2d5d0b7a",
  personalizations: [
    {
      to: data.email,
      dynamicTemplateData: { 
        name: data.firstName,
        token: data.token
      },
    }
  ]
};

return this.sendgridService.send(msg).pipe(
  catchError(err=>of(`sending email failed:${err}`)),
  tap(data => console.log(data)),
  mergeMap(data => from(created)),
);
```
