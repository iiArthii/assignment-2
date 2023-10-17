import React from 'react';

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

export default PhoneList;