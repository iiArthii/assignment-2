import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
    const [allContacts, setAllContacts] = useState([]);
    const [newContactName, setNewContactName] = useState('');

    const fetchData = async (url, options = {}) => {
        const response = await fetch(url, options);
        return response.json();
    };

    const retrieveContacts = useCallback(async () => {
        try {
            const data = await fetchData('http://localhost:5000/api/contacts');
            setAllContacts(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        retrieveContacts();
    }, [retrieveContacts]);

    const createContact = async (name) => {
        if (name.trim() === '') {
            alert('Contact name cannot be blank');
            return;
        }
        try {
            await fetchData('http://localhost:5000/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            retrieveContacts();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteContact = async (contactId) => {
        try {
            await fetchData(`http://localhost:5000/api/contacts/${contactId}`, {
                method: 'DELETE',
            });
            retrieveContacts();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container">
            <h1 className="header">Contactor</h1>
            <div className="mainContainer">
                <h2 className="contactHeader">Contact</h2>
                <div className="contactForm">
                    <input
                        className="input"
                        type="text"
                        placeholder="Name"
                        value={newContactName}
                        onChange={(e) => setNewContactName(e.target.value)}
                    />
                    <button
                        className="buttonCreate"
                        onClick={() => createContact(newContactName)}
                    >
                        Create Contact
                    </button>
                </div>
                <hr />
                <div className="contactList">
                    {allContacts.map((singleContact) => (
                        <ContactList
                            key={singleContact.id}
                            contact={singleContact}
                            deleteContact={deleteContact}
                            fetchData={fetchData}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ContactList({ contact, deleteContact, fetchData }) {
    const [contactPhones, setContactPhones] = useState([]);
    const [phoneName, setPhoneName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showDetails, setShowDetails] = useState(false);

    const retrievePhones = async () => {
        try {
            const data = await fetchData(
                `http://localhost:5000/api/contacts/${contact.id}/phones`
            );
            setContactPhones(data);
        } catch (error) {
            console.error('Error fetching phones:', error);
        }
    };

    useEffect(() => {
        retrievePhones();
    }, [contact.id, fetchData]);

    const createPhone = async () => {
        if (!phoneName.trim() || !phoneNumber.trim()) {
            alert('Both phone name and number are required!');
            return;
        }
        try {
            await fetchData(`http://localhost:5000/api/contacts/${contact.id}/phones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: phoneName,
                    number: phoneNumber,
                    contactId: contact.id,
                }),
            });
            setPhoneName('');
            setPhoneNumber('');
            retrievePhones();
        } catch (error) {
            console.error('Error adding phone:', error);
        }
    };

    const deletePhone = async (phoneId) => {
        try {
            await fetchData(
                `http://localhost:5000/api/contacts/${contact.id}/phones/${phoneId}`,
                {
                    method: 'DELETE',
                }
            );
            retrievePhones();
        } catch (error) {
            console.error('Error deleting phone:', error);
        }
    };

    return (
        <div className="contactList">
            <div
                className="contactInfo"
                onClick={() => setShowDetails(!showDetails)}
            >
                <div className="contactName">{contact.name}</div>
                <button
                    className="contactDeleteButton"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteContact(contact.id);
                    }}
                >
                    Delete
                </button>
            </div>
            {showDetails && (
                <>
                    <div className="phoneDetails">
                        <div className="phoneInput">
                            <input
                                className="input"
                                placeholder="Name"
                                value={phoneName}
                                onChange={(e) => setPhoneName(e.target.value)}
                            />
                            <input
                                className="input"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <button className="button" onClick={createPhone}>
                                Create
                            </button>
                        </div>
                        <table className="table">
                            <thead>
                                <tr className="row">
                                    <th className="headerCell">Name</th>
                                    <th className="headerCell">Number</th>
                                    <th className="headerCell"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {contactPhones.map((phone) => (
                                    <tr key={phone.id} className="row">
                                        <td className="cell">{phone.name}</td>
                                        <td className="cell">{phone.number}</td>
                                        <td className="cell">
                                            <button
                                                className="buttonDelete"
                                                onClick={() => deletePhone(phone.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;