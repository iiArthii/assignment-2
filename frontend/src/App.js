import React, { useState, useEffect } from 'react';

import CreateContact from './CreateContact';
import ContactList from './ContactList';
import PhoneList from './PhoneList';

import './App.css';

function App() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        fetch('/api/contacts')
            .then(response => response.json())
            .then(data => setContacts(data))
            .catch(error => {
                console.error('Error fetching contacts:', error);
            });
    }, []);

    const handleContactSelect = (contactId) => {
        setSelectedContact(contactId);
    };

    const handleContactCreate = (newContact) => {
        fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newContact),
        })
            .then(response => response.json())
            .then(data => {
                setContacts([...contacts, data]);
            })
            .catch(error => {
                console.error('Error creating contact:', error);
            });
    };

    const handleContactDelete = (contactId) => {
        fetch(`/api/contacts/${contactId}`, {
            method: 'DELETE',
        })
            .then(() => {
                const updatedContacts = contacts.filter(contact => contact.id !== contactId);
                setContacts(updatedContacts);
                setSelectedContact(null);
            })
            .catch(error => {
                console.error('Error deleting contact:', error);
            });
    };

    return (
        <div>
            <h1>Contactor</h1>

            <CreateContact onCreate={handleContactCreate} />

            <ContactList
                contacts={contacts}
                onSelect={handleContactSelect}
                onDelete={handleContactDelete}
            />

            {selectedContact && <PhoneList contactId={selectedContact} />}
        </div>
    );
}

export default App;