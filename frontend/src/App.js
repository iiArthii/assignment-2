import React, { useState, useEffect } from 'react';
import axios from 'axios';

import CreateContact from './CreateContact';
import ContactList from './ContactList';
import PhoneList from './PhoneList';

import './App.css';

function App() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        axios.get('/api/contacts')
            .then(response => {
                setContacts(response.data);
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
            });
    }, []);

    const handleContactSelect = (contactId) => {
        setSelectedContact(contactId);
    };

    const handleContactCreate = (newContact) => {
        axios.post('/api/contacts', newContact)
            .then(response => {
                setContacts([...contacts, response.data]);
            })
            .catch(error => {
                console.error('Error creating contact:', error);
            });
    };

    const handleContactDelete = (contactId) => {
        axios.delete(`/api/contacts/${contactId}`)
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