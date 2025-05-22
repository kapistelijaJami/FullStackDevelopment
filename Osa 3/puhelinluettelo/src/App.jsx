import { useEffect, useState } from "react";
import personService from "./services/persons";
import Notification from "./Notification";

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with: <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

const PersonForm = ({
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
  handleAddPerson,
}) => {
  return (
    <form onSubmit={handleAddPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, filter, del }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter)
  );

  return filteredPersons.map((person) => (
    <p key={person.name}>
      {person.name} {person.number}{" "}
      <button onClick={() => del(person)}>delete</button>
    </p>
  ));
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationSuccess, setNotificationSuccess] = useState(true);

  useEffect(() => {
    personService.getAll().then((res) => {
      setPersons(res);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleAddPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      if (
        !window.confirm(
          newName +
            " is already added to phonebook, replace the old number with a new one?"
        )
      ) {
        return;
      }

      const newPerson = { ...existingPerson, number: newNumber };
      personService.update(newPerson.id, newPerson).then((res) => {
        setPersons(
          persons.map((person) => (person.id !== res.id ? person : res))
        );
        setNewName("");
        setNewNumber("");
        showNotification(newPerson.name + " was modified successfully!", true);
      }).catch(() => {
        showNotification("Person " + newPerson.name + " was already removed from server.", false);
        setPersons(persons.filter((person) => person.id !== newPerson.id));
      });

      return;
    }
    
    const newPerson = { name: newName, number: newNumber };
    personService.create(newPerson).then((res) => {
      setPersons(persons.concat(res));
      setNewName("");
      setNewNumber("");
      showNotification(newPerson.name + " was added successfully!", true);
    });
  };

  const deletePerson = (person) => {
    if (!window.confirm("Delete " + person.name + "?")) {
      return;
    }
    personService.del(person.id).then(() => {
      setPersons(persons.filter((p) => p.id !== person.id));
      showNotification(person.name + " was removed successfully!", true);
    });
  };

  const showNotification = (message, success) => {
    setNotificationMessage(message);
    setNotificationSuccess(success);
    window.setTimeout(() => setNotificationMessage(null), 3000);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} success={notificationSuccess} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleAddPerson={handleAddPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} del={deletePerson} />
    </div>
  );
};

export default App;
