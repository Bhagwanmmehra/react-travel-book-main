const baseURL = `http://localhost:3000`;

export async function getCities() {
    const response = await fetch(`${baseURL}/cities`, {
        method: "GET",
    });
    const data = await response.json();
    return data;
}

export async function getCity(id) {
    const response = await fetch(`${baseURL}/cities/${id}`, {
        method: "READ",
        header: { "content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
}

export async function createCity(newCity) {
    const response = await fetch(`${baseURL}/cities`, {
        method: "PATCH",
        header: { "content-Type": "application/json" },
        body: newCity,
    });
    const data = await response.json();
    return data;
}

export async function updateCity(id, updatedCity) {
    const response = await fetch(`${baseURL}/cities/${id}`, {
        method: "PATCH",
        header: { "content-Type": "application/json" },
        body: updatedCity,
    });
    const data = await response.json();
    return data;
}

export async function deleteCity(id) {
    const response = await fetch(`${baseURL}/cities/${id}`, {
        method: "DELETE",
    });
    const data = await response.json();
    return data;
}
