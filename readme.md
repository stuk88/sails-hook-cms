# Sails.JS 0.12 Content Management System

> Beaware: This hook is still in a very early stages. Its working great, but bugs can occur.
> Please open an issue and I will try my best to help.

## The Vision

I would like to have a minimal API but still have a decent flexibility.

## Why

The objective of this sails hook is to provide an easy way to create a simple CMS for your current data structure.  
The hook reads the models schema and builds a simple CRUD operations, and creats a Content Management System on top of your current sails project.

## Installation

* Create a Users model with the fields `email`, `password` (md5 based), and `role`
* Install using `npm i git+https://github.com/stuk88/sails-hook-cms.git` and then navigate to `http://localhost:1337/admin`

## Routes

This hooks introduces a couple of routes to your application.
- `http://localhost:1337/admin/login` Admin login page - Based on Users model

```
{
'POST /admin/login': function (req, res, next) {
          Users.findOne({email: req.body.email, password: md5(req.body.password), role: 'admin'}).then((user) => {
            if (!user)
              return res.redirect('/admin');

            req.session.userId = user.id;

            return res.redirect(req.query.referer);
          })
        }
}
```
The query to verify a user is based on Users model.
`email`, `password`, and `role` are required fields.
The password must be encrypted with md5. (for other better encryption request's please open an issue)
The authorizetion is based on saving the user id in the session.
- `http://localhost:1337/admin/logout` Logout page

- `http://localhost:1337/admin` Dashboard main page
- `http://localhost:1337/admin/:model` A list of items
- `http://localhost:1337/admin/:model/create` The form to create a new item
- `http://localhost:1337/admin/:model/store` Save the new item
- `http://localhost:1337/admin/:model/edit/:modelId` The form to edit an item
- `http://localhost:1337/admin/:model/update/:modelId` Update an item
- `http://localhost:1337/admin/:model/duplicate/:modelId` Duplicate an item
- `http://localhost:1337/admin/:model/delete/:modelId` Delete an item

## Options
I want this hook to work as plug and play. However if you want more control over the CMS I want to be able to provide those configurations to set things up.
The base config file should be in `config/misc.js` and contains:
```
module.exports = {
  cms: {

    title: 'App Name', // The name of the app that appears on the logo as alt
    logo_url: '/images/logo.svg',
    styles: [
      // the styles to load in the admin, allows to attach custom styles and redesign the cms as you like
      '/styles/admin.css'
    ]
  }
}

```

Having for example a model named `Book`, But we maybe want to change the way it displays to be `Books`.
In this case we can override the model.name with a label *Books* and removed the createdAt and updatedAt fields.

```
module.exports = {

  // CMS Extra config (Optional)
  cms: {
    // You can override the model displayed name with label
    label: "Books",
    // This field defines the field to use as the item title, in relation (Assosiation) attributes.
    // Default title field is 'name'
    title: "name",
    
    // Sometimes you dont want to display some attributes
    // so we can hide them.
    // so writing the attribute name, and setting it to false, tell's the CMS to not display the attribute in the table view.
    createdAt:false, 
    updatedAt:false,
    id:true
  },
  
  attributes: {
    // Name attribute could be a instance function too.
    name: 'string',
    description: 'text',
    danum: 'integer',
    dafloat: 'float',
    dadate: 'date',
    dadatetime: 'datetime',
    dabool: 'boolean',
    darray: 'array',
    dajson: 'json',
    enum: {
        type:'string',
        enum: ['a','b','c']
    },
    model: 'categories',
    collection: 'categories'
  }
};
```

## You can help!
* We need to transform jade templates into pug or ejs to support auto system updates. (Currently we have some major issues because Jade is DEPRECATED).
* Add support for sails 1.0 (Add another Schema parser)

## Support
Please open an issue.
