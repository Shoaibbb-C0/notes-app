import { supabase } from './supabase.js'

// ---- AUTH LISTENERS ----

document.getElementById('signup-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    alert(error.message)
  } else {
    alert('Check your email to confirm signup!')
  }
})

document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    alert(error.message)
  } else {
    showNotesSection()
    fetchNotes()
  }
})

document.getElementById('logout-btn').addEventListener('click', async () => {
  await supabase.auth.signOut()
  document.getElementById('auth-section').style.display = 'block'
  document.getElementById('notes-section').style.display = 'none'
})

// ---- NOTES ----

document.getElementById('create-btn').addEventListener('click', async () => {
  const title = document.getElementById('note-title').value.trim()
  const content = document.getElementById('note-content').value.trim()

  if (!title) {
    alert('Please add a title')
    return
  }

  if (!content) {
    alert('Please add some content')
    return
  }

  const createBtn = document.getElementById('create-btn')
  createBtn.textContent = 'Adding...'
  createBtn.disabled = true

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('notes').insert({
    title,
    content,
    user_id: user.id
  })

  createBtn.textContent = '+ Add Note'
  createBtn.disabled = false

  if (error) {
    alert('Failed to create note: ' + error.message)
  } else {
    document.getElementById('note-title').value = ''
    document.getElementById('note-content').value = ''
    fetchNotes()
  }
})

// ---- FETCH NOTES ----

async function fetchNotes() {
  const list = document.getElementById('notes-list')
  list.innerHTML = '<p>Loading notes...</p>'

  const { data, error } = await supabase.from('notes').select('*')

  if (error) {
    list.innerHTML = '<p>Failed to load notes. Please refresh.</p>'
    console.log(error)
    return
  }

  list.innerHTML = ''

  if (data.length === 0) {
    list.innerHTML = '<p>No notes yet. Add one above.</p>'
    return
  }

  data.forEach(note => {
    const div = document.createElement('div')
    div.className = 'note-card'
    div.innerHTML = `
      <div id="view-${note.id}">
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <div class="note-actions">
          <button class="edit-btn" onclick="editNote('${note.id}', '${note.title}', '${note.content}')">Edit</button>
          <button class="delete-btn" onclick="deleteNote('${note.id}')">Delete</button>
        </div>
      </div>
      <div id="edit-${note.id}" style="display:none">
        <input type="text" id="edit-title-${note.id}" value="${note.title}" />
        <textarea id="edit-content-${note.id}">${note.content}</textarea>
        <div class="note-actions">
          <button class="save-btn" onclick="saveNote('${note.id}')">Save</button>
          <button class="cancel-btn" onclick="cancelEdit('${note.id}')">Cancel</button>
        </div>
      </div>
    `
    list.appendChild(div)
  })
}

// ---- HELPERS ----

function showNotesSection() {
  document.getElementById('auth-section').style.display = 'none'
  document.getElementById('notes-section').style.display = 'block'
}

// Check if user is already logged in on page load
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    showNotesSection()
    fetchNotes()
  }
})

// ---- NOTE ACTIONS ----

window.editNote = (id, title, content) => {
  document.getElementById(`view-${id}`).style.display = 'none'
  document.getElementById(`edit-${id}`).style.display = 'block'
}

window.cancelEdit = (id) => {
  document.getElementById(`view-${id}`).style.display = 'block'
  document.getElementById(`edit-${id}`).style.display = 'none'
}

window.saveNote = async (id) => {
  const title = document.getElementById(`edit-title-${id}`).value.trim()
  const content = document.getElementById(`edit-content-${id}`).value.trim()

  if (!title) {
    alert('Title cannot be empty')
    return
  }

  if (!content) {
    alert('Content cannot be empty')
    return
  }

  const { error } = await supabase
    .from('notes')
    .update({ title, content })
    .eq('id', id)

  if (error) {
    alert('Failed to update note: ' + error.message)
  } else {
    fetchNotes()
  }
}

window.deleteNote = async (id) => {
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (!error) fetchNotes()
}