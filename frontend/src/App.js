import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [phones, setPhones] = useState([]);
    const [newPhone, setNewPhone] = useState({ name: '', number: '' });

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
            .catch(error => {
                console.error('Error creating contact:', error);
            });
    };

    const handlePhoneCreate = () => {
        const { name, number } = newPhone;
        if (name && number) {
            const newPhoneData = { name, number, contactId: selectedContact };
            fetch(`http://localhost:5000/api/contacts/${selectedContact}/phones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPhoneData),
            })
                .then(response => response.json())
                .then(data => {
                    setPhones([...phones, data]);
                })
                .catch(error => {
                    console.error('Error creating phone number:', error);
                });
            setNewPhone({ name: '', number: '' });
        }
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

    return (
        <div>
            <h1>Contactor</h1>

            <CreateContact onCreate={handleContactCreate} />
            
            <div>
                <h2>Create New Phone Number</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={newPhone.name}
                    onChange={(e) => setNewPhone({ ...newPhone, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Number"
                    value={newPhone.number}
                    onChange={(e) => setNewPhone({ ...newPhone, number: e.target.value })}
                />
                <button onClick={handlePhoneCreate}>Create</button>
            </div>

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

function PhoneList({ phones }) {
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

export default App;