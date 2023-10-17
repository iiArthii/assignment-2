import React, { useState } from 'react';

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

export default CreateContact;