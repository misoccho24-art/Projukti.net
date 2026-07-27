# Making this site editable — setup steps

Your site now has a built-in editor at **admin.html**. Your client logs in
there, edits any text on the Home or Contact page, hits Save, and the live
site updates immediately (no code changes, no re-uploading files).

You said you already have a Firebase project, so here's exactly what's left:

## 1. Plug in your Firebase config
Open `firebase-config.js` and replace the placeholder values with your
project's real config:

Firebase Console → ⚙️ Project settings → General tab → scroll to
"Your apps" → your Web app → **SDK setup and configuration** → select
**Config** → copy the `firebaseConfig` object → paste it into
`firebase-config.js` in place of the placeholder one.

If you don't have a Web app registered yet in this project: Project
settings → "Your apps" → click the `</>` (Web) icon → register an app
(no need to check Firebase Hosting unless you want it) → you'll get the
config object.

## 2. Turn on Firestore (if not already on)
Firebase Console → **Build → Firestore Database** → Create database →
production mode → pick a region → Create.

## 3. Set the security rules
Firestore Database → **Rules** tab → replace the contents with what's in
`firestore.rules` (included in this folder) → Publish.

This makes the site's text publicly readable (so visitors can see it) but
only editable by someone who's logged in.

## 4. Turn on Email/Password sign-in
Firebase Console → **Build → Authentication** → **Sign-in method** tab →
click **Email/Password** → enable it → Save.

## 5. Add your client as a user
Authentication → **Users** tab → **Add user** → enter the email and a
password you choose for them → Add user.

That's the login your client will use on `admin.html`. You can add more
than one user here later if needed, or come back and change/reset a
password from this same screen.

## 6. Upload everything, together, to the same folder/domain
All of these files need to sit in the same folder online so the relative
links between them work:

```
index.html
contact.html
firebase-config.js
content-loader.js
admin.html
index.css
(+ all the existing images/icons)
```

**Important:** because `admin.html` loads `index.html` and `contact.html`
with `fetch()` to build its edit form, the site needs to be served over
`http://` or `https://` (e.g. Firebase Hosting, or any normal web host) —
opening the files directly from disk (`file://...`) won't work for the
editor, though the public pages will still display fine either way.

Firebase Hosting is a free, easy option if you don't have hosting yet —
happy to walk through that separately if useful.

## How it works, in short
- Every editable bit of text in `index.html` / `contact.html` has an
  invisible tag (`data-edit-id`) marking it as editable.
- `admin.html` scans both pages for those tags, builds a form grouped by
  section (Hero, each Doctor, Footer, etc.), and pre-fills it with
  whatever's already saved.
- Saving writes everything to one Firestore document (`content/site`).
- `content-loader.js`, included on the public pages, quietly checks that
  document on every page load and swaps in any saved text — if nothing's
  been saved yet, or Firestore can't be reached, the page just shows its
  normal built-in text, so the site never breaks.
- A few fields (like each doctor's phone numbers) are linked to their
  "tap to call" button, so editing the number also updates the link.

## Known limits (given the "edit everything" scope)
- The site-wide call buttons in the nav bar, the floating call button,
  and the hero button link to the phone number in their `href`, but only
  their *button label* text (e.g. "সিরিয়াল করুন") is editable — if the
  actual phone number changes, those specific links still need a code
  edit. Each doctor's listed numbers and the footer numbers are fully
  editable and don't need code changes.
- Images (doctor photos, icons, logo) aren't part of this text editor —
  say the word if you'd like image swapping added too.
