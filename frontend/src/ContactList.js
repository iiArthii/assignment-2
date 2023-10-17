import React from 'react';

function ContactList({ contacts, onSelect, onDelete }) {
    return (
        <div>
            <h2>Contact List</h2>
            <ul>
                {contacts.map((contact) => (
                    <li key={contact.id}>
                        {contact.name}
                        <button onClick={() => onSelect(contact.id)}>Select</button>
                        <button onClick={() => onDelete(contact.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ContactList;