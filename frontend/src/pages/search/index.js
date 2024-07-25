import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SearchService from 'meutcc/services/SearchService';

const SearchResults = () => {
    const router = useRouter();
    const { q } = router.query;
    const [results, setResults] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchResults = async () => {
            if (q) {
                try {
                    const response = await SearchService.search(q);
                    setResults(response.filter(result => result.type === 'user' || result.type === 'tcc'));
                } catch (error) {
                    console.error("Erro ao buscar resultados:", error);
                }
            }
        };
        fetchResults();
    }, [q]);

    const countResults = (type) => {
        return results.filter(result => result.type === type).length;
    };

    const filteredResults = results.filter(result => {
        if (filter === 'all') return true;
        return result.type === filter;
    });

    return (
        <div className="container">
            <style jsx>{`
                .container {
                    display: flex;
                    max-width: 100%;
                    padding: 20px;
                    justify-content: center;
                    gap: 20px;
                }
                .sidebar {
                    width: 300px;
                    padding: 20px;
                    background: white;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    height: fit-content;
                }
                .sidebar h2 {
                    font-size: 1.25rem;
                    margin-bottom: 1rem;
                }
                .sidebar ul {
                    list-style: none;
                    padding: 0;
                }
                .sidebar ul li {
                    margin-bottom: 0.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .sidebar ul li button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    text-align: left;
                    flex-grow: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 5px 0;
                }
                .sidebar ul li button:hover {
                    text-decoration: underline;
                }
                .sidebar ul li .count {
                    background-color: #e1e4e8;
                    border-radius: 2em;
                    padding: 2px 8px;
                    font-size: 0.875rem;
                    color: #586069;
                    margin-left: 10px;
                }
                .main-content {
                    flex-grow: 1;
                    padding: 20px;
                    background: white;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    overflow: hidden;
                    max-width: 800px;
                }
                .main-content h1 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                }
                .main-content ul {
                    list-style: none;
                    padding: 0;
                }
                .main-content ul li {
                    padding: 10px 0;
                    border-bottom: 1px solid #ddd;
                }
                .main-content ul li a {
                    text-decoration: none;
                    color: #007bff;
                }
                .main-content ul li a:hover {
                    text-decoration: underline;
                }
            `}</style>
            <aside className="sidebar">
                <h2>Filtros</h2>
                <ul>
                    <li>
                        <button className={filter === 'all' ? 'font-bold' : ''} onClick={() => setFilter('all')}>
                            Todos
                            <span className="count">{results.length}</span>
                        </button>
                    </li>
                    <li>
                        <button className={filter === 'user' ? 'font-bold' : ''} onClick={() => setFilter('user')}>
                            Usuários
                            <span className="count">{countResults('user')}</span>
                        </button>
                    </li>
                    <li>
                        <button className={filter === 'tcc' ? 'font-bold' : ''} onClick={() => setFilter('tcc')}>
                            TCCs
                            <span className="count">{countResults('tcc')}</span>
                        </button>
                    </li>
                </ul>
            </aside>
            <main className="main-content">
                <h1>Resultados da busca por: {q}</h1>
                <ul>
                    {filteredResults.length > 0 ? (
                        filteredResults.map((result, index) => (
                            <li key={index}>
                                {result.type === 'user' ? (
                                    <a href={`/perfil/${result.id}`}>{result.label}</a>
                                ) : (
                                    <a href={`/detalhes-tcc/${result.id}`}>{result.label}</a>
                                )}
                            </li>
                        ))
                    ) : (
                        <p>Nenhum resultado encontrado.</p>
                    )}
                </ul>
            </main>
        </div>
    );
};

export default SearchResults;
