import React, { useState, useEffect } from 'react';

import CreateContact from './CreateContact';
import ContactList from './ContactList';
import PhoneList from './PhoneList';

import './App.css';

function App() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [phones, setPhones] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/contacts')
            .then(response => response.json())
            .then(data => setContacts(data))
            .catch(error => {
                console.error('Error fetching contacts:', error);
            });
    }, []);

    const handleContactSelect = (contactId) => {
        setSelectedContact(contactId);

        fetch(`http://localhost:5001/api/contacts${contactId}/phones`)
            .then(response => response.json())
            .then(data => {
                setPhones(data);
            })
            .catch(error => {
                console.error('Error fetching phone numbers:', error);
            });
    };

    const handleContactCreate = (newContact) => {
        fetch('http://localhost:5001/api/contacts', {
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
        fetch(`http://localhost:5001/api/contacts${contactId}`, {
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

            {selectedContact && (
                <div>
                    <PhoneList phones={phones} />
                </div>
            )}
        </div>
    );
}

export default App;