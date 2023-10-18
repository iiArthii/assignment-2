import React, { useState, useEffect } from 'react';

import './App.css';

function App() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [phones, setPhones] = useState([]);
    const [newPhoneName, setNewPhoneName] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/contacts')
            .then(response => response.json())
            .then(data => setContacts(data))
            .catch(error => {
                console.error('Error fetching contacts:', error);
            });
    }, []);

    const handleContactCreate = (newContact) => {
        fetch('http://localhost:5000/api/contacts', {
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
            .catch (error => {
                console.error('Error creating contact:', error);
            });
    };

    const handleContactSelect = (contactId) => {
        setSelectedContact(contactId);

        fetch(`http://localhost:5000/api/contacts/${contactId}/phones`)
            .then(response => response.json())
            .then(data => {
                setPhones(data);
            })
            .catch(error => {
                console.error('Error fetching phone numbers:', error);
            });
    };

    const handleContactDelete = (contactId) => {
        fetch(`http://localhost:5000/api/contacts/${contactId}`, {
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

    const handlePhoneCreate = (newPhone) => {
        if (selectedContact && newPhoneName && newPhoneNumber) {
            fetch(`http://localhost:5000/api/contacts/${selectedContact}/phones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPhone),
            })
            .then(response => response.json())
            .then(data => {
                const createdPhone = data;
                setPhones([...phones, createdPhone]);
                setNewPhoneName('');
                setNewPhoneNumber('');
            })
            .catch(error => {
                console.error('Error creating phone:', error);
            });
        }
    };

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

    function CreateContact({ onCreate }) {
        const [name, setName] = useState('');

        const handleCreateContact = () => {
            if (name) {
                const newContact = { name };
                onCreate(newContact);
                setName('');
            }
        };

        return (
            <div>
                <h2>Create New Contact</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={handleCreateContact}>Create</button>
            </div>
    );
}

function CreatePhone({ onCreate }) {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');

    const handlePhoneCreate = () => {
        if (name && number) {
            const newPhone = { name, number };
            onCreate(newPhone);
            setName('');
            setNumber('');
        }
    };

    return (
        <div>
            <h2>Create New Phone Number</h2>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
            />
            <button onClick={handlePhoneCreate}>Create</button>
        </div>
    );
}

function PhoneList({ phones }) {
    if (!Array.isArray(phones)) {
        return (
            <div>
                <h2>Phone Numbers</h2>
                <p>No phone numbers found.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Phone Numbers</h2>
            <ul>
                {phones.map((phone) => (
                    <li key={phone.id}>
                        {phone.name}: {phone.number}: {phone.contactId}
                    </li>
                ))}
            </ul>
        </div>
    );
}

return (
    <div>
        <h1>Contactor</h1>

        <CreateContact onCreate={handleContactCreate} />

        <CreatePhone onCreate={handlePhoneCreate} />

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
