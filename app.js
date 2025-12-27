const { useState, useEffect, useRef } = React;

const Win98Todo = () => {
  // Initialize todos from localStorage or use defaults
  const getInitialTodos = () => {
    const saved = localStorage.getItem('win98-todos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [
          { id: 1, text: 'Welcome to Windows 98 TODO!', completed: false, priority: 'normal', dueDate: '' },
          { id: 2, text: 'Click checkboxes to complete tasks', completed: false, priority: 'normal', dueDate: '' }
        ];
      }
    }
    return [
      { id: 1, text: 'Welcome to Windows 98 TODO!', completed: false, priority: 'normal', dueDate: '' },
      { id: 2, text: 'Click checkboxes to complete tasks', completed: false, priority: 'normal', dueDate: '' }
    ];
  };

  const [todos, setTodos] = useState(getInitialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState('normal');
  const [newDueDate, setNewDueDate] = useState('');
  const [showAbout, setShowAbout] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggType, setEasterEggType] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsArticles, setNewsArticles] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [konamiCode, setKonamiCode] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const clickTimer = useRef(null);

  // Easter Egg: Konami Code (↑↑↓↓←→←→BA)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const code = [...konamiCode, e.key].slice(-10);
      setKonamiCode(code);
      
      // Check for Konami code
      const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
      if (code.join(',') === konamiPattern.join(',')) {
        setEasterEggType('konami');
        setShowEasterEgg(true);
        setKonamiCode([]);
      }

      // Easter Egg: Type "clippy"
      const recent = code.slice(-6).join('');
      if (recent === 'clippy') {
        setEasterEggType('clippy');
        setShowEasterEgg(true);
        setKonamiCode([]);
      }

      // Easter Egg: Type "retro"
      if (recent.includes('retro')) {
        setEasterEggType('retro');
        setShowEasterEgg(true);
        setKonamiCode([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiCode]);

  // Easter Egg: Click title 10 times
  const handleTitleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (clickTimer.current) clearTimeout(clickTimer.current);
    
    if (newCount >= 10) {
      setEasterEggType('secret');
      setShowEasterEgg(true);
      setClickCount(0);
    } else {
      clickTimer.current = setTimeout(() => setClickCount(0), 2000);
    }
  };

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('win98-todos', JSON.stringify(todos));
  }, [todos]);

  // Fetch news when news panel opens
  useEffect(() => {
    if (showNews && newsArticles.length === 0) {
      fetchNews();
    }
  }, [showNews]);

  const fetchNews = async () => {
    setLoadingNews(true);
  
    try {
      const data = await window.electronAPI.fetchNews();
  
      if (data?.articles?.length) {
        setNewsArticles(
          data.articles.map((a, i) => ({
            id: i,
            title: a.title,
            description: a.description || 'No description available',
            date: new Date(a.publishedAt).toLocaleDateString(),
            source: a.source.name,
            url: a.url
          }))
        );
      } else {
        setNewsArticles([]);
      }
    } catch {
      setNewsArticles([]);
    }
  
    setLoadingNews(false);
  };  
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: newTodo, 
        completed: false,
        priority: newPriority,
        dueDate: newDueDate,
        createdAt: new Date().toISOString()
      }]);
      setNewTodo('');
      setNewPriority('normal');
      setNewDueDate('');

      // Easter egg: Add special task
      if (newTodo.toLowerCase().includes('secret')) {
        setTimeout(() => {
          setEasterEggType('task');
          setShowEasterEgg(true);
        }, 500);
      }
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 font-bold';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      default: return '';
    }
  };

  const getPrioritySymbol = (priority) => {
    switch(priority) {
      case 'high': return '❗';
      case 'medium': return '⚠️';
      case 'low': return '⬇️';
      default: return '';
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'active' ? !todo.completed :
      filter === 'completed' ? todo.completed :
      filter === 'high' ? todo.priority === 'high' : true;
    
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, normal: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Calculator functions
  const handleCalcClick = (value) => {
    if (value === 'C') {
      setCalcDisplay('0');
    } else if (value === '=') {
      try {
        setCalcDisplay(String(eval(calcDisplay)));
      } catch {
        setCalcDisplay('Error');
      }
    } else if (calcDisplay === '0' && value !== '.') {
      setCalcDisplay(value);
    } else {
      setCalcDisplay(calcDisplay + value);
    }
  };

  return (
    <div className="w-full h-screen bg-[#008080] overflow-hidden select-none relative">
      <style>{`
        * {
          font-family: 'MS Sans Serif', 'Microsoft Sans Serif', Tahoma, Arial, sans-serif;
        }
        .win98-border {
          border-top: 2px solid #ffffff;
          border-left: 2px solid #ffffff;
          border-right: 2px solid #000000;
          border-bottom: 2px solid #000000;
          box-shadow: 1px 1px 0 #808080;
        }
        .win98-inset {
          border-top: 2px solid #808080;
          border-left: 2px solid #808080;
          border-right: 2px solid #dfdfdf;
          border-bottom: 2px solid #dfdfdf;
        }
        .win98-button {
          border-top: 2px solid #ffffff;
          border-left: 2px solid #ffffff;
          border-right: 2px solid #000000;
          border-bottom: 2px solid #000000;
          box-shadow: 1px 1px 0 #808080;
        }
        .win98-button:active {
          border-top: 2px solid #000000;
          border-left: 2px solid #000000;
          border-right: 2px solid #ffffff;
          border-bottom: 2px solid #ffffff;
          box-shadow: none;
        }
        .title-button {
          width: 16px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          padding: 0;
        }
        .title-button:active {
          border-top: 1px solid #000000;
          border-left: 1px solid #000000;
          border-right: 1px solid #ffffff;
          border-bottom: 1px solid #ffffff;
        }
        .title-bar {
          -webkit-app-region: drag;
        }
        .title-button {
          -webkit-app-region: no-drag;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .bounce {
          animation: bounce 0.5s ease infinite;
        }
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .rainbow {
          background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
          background-size: 200% 200%;
          animation: rainbow 3s linear infinite;
        }
      `}</style>
      
      <div
        style={{
          width: '100%',
          height: '100%'
        }}
        className="bg-[#c0c0c0] win98-border flex flex-col"
      >
        <div
          className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-1 py-0.5 flex items-center justify-between title-bar"
          onClick={handleTitleClick}
        >
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-white border border-black flex items-center justify-center text-xs">
              📝
            </div>
            <span className="text-white text-sm font-bold">TODO List - Windows 98</span>
          </div>
          <div className="flex gap-0.5">
            <button 
              className="title-button bg-[#c0c0c0] win98-border hover:bg-[#d4d4d4]"
              onClick={(e) => {
                e.stopPropagation();
                window.electronAPI?.minimizeWindow();
              }}
            >_</button>
            <button 
              className="title-button bg-[#c0c0c0] win98-border hover:bg-[#d4d4d4]"
              onClick={(e) => {
                e.stopPropagation();
                window.electronAPI?.maximizeWindow();
              }}
            >□</button>
            <button
              className="title-button bg-[#c0c0c0] win98-border hover:bg-[#d4d4d4]"
              onClick={(e) => {
                e.stopPropagation();
                window.electronAPI?.closeWindow();
              }}
            >×</button>
          </div>
        </div>

        <div className="bg-[#c0c0c0] border-b-2 border-white px-1 py-0.5 flex gap-2 text-sm">
          <div className="relative">
            <div 
              className="px-2 hover:bg-[#000080] hover:text-white cursor-pointer"
              onClick={() => {
                setShowFileMenu(!showFileMenu);
                setShowEditMenu(false);
                setShowViewMenu(false);
              }}
            >
              <span className="underline">F</span>ile
            </div>
            {showFileMenu && (
              <div className="absolute top-full left-0 bg-[#c0c0c0] win98-border w-44 text-sm z-20 mt-0.5">
                <div 
                  className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => {
                    setTodos([]);
                    setShowFileMenu(false);
                  }}
                >
                  <span className="underline">N</span>ew List
                </div>
                <div className="h-px bg-[#808080] my-1 mx-1"></div>
                <div 
                  className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => {
                    const data = JSON.stringify(todos, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'todos.json';
                    a.click();
                    setShowFileMenu(false);
                  }}
                >
                  <span className="underline">S</span>ave
                </div>
                <div 
                  className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        try {
                          const loaded = JSON.parse(e.target.result);
                          setTodos(loaded);
                        } catch (err) {
                          alert('Error loading file');
                        }
                      };
                      reader.readAsText(file);
                    };
                    input.click();
                    setShowFileMenu(false);
                  }}
                >
                  <span className="underline">O</span>pen
                </div>
                <div className="h-px bg-[#808080] my-1 mx-1"></div>
                <div 
                  className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => {
                    setShowFileMenu(false);
                    window.electronAPI?.closeWindow();
                  }}
                >
                  E<span className="underline">x</span>it
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <div 
              className="px-2 hover:bg-[#000080] hover:text-white cursor-pointer"
              onClick={() => {
                setShowEditMenu(!showEditMenu);
                setShowFileMenu(false);
                setShowViewMenu(false);
              }}
            >
              <span className="underline">E</span>dit
            </div>
            {showEditMenu && (
              <div className="absolute top-full left-0 bg-[#c0c0c0] win98-border w-44 text-sm z-20 mt-0.5">
                <div 
                  className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => {
                    clearCompleted();
                    setShowEditMenu(false);
                  }}
                >
                  Clear <span className="underline">C</span>ompleted
                </div>
                <div 
                  className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => {
                    setTodos(todos.map(t => ({ ...t, completed: true })));
                    setShowEditMenu(false);
                  }}
                >
                  Select <span className="underline">A</span>ll
                </div>
                <div 
                  className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => {
                    setTodos(todos.map(t => ({ ...t, completed: false })));
                    setShowEditMenu(false);
                  }}
                >
                  <span className="underline">U</span>nselect All
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div 
              className="px-2 hover:bg-[#000080] hover:text-white cursor-pointer"
              onClick={() => {
                setShowViewMenu(!showViewMenu);
                setShowFileMenu(false);
                setShowEditMenu(false);
              }}
            >
              <span className="underline">V</span>iew
            </div>
            {showViewMenu && (
              <div className="absolute top-full left-0 bg-[#c0c0c0] win98-border w-44 text-sm z-20 mt-0.5">
                <div 
                  className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => {
                    setFilter('all');
                    setShowViewMenu(false);
                  }}
                >
                  {filter === 'all' && '✓ '}<span className="underline">A</span>ll Tasks
                </div>
                <div 
                  className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => {
                    setFilter('active');
                    setShowViewMenu(false);
                  }}
                >
                  {filter === 'active' && '✓ '}Active <span className="underline">T</span>asks
                </div>
                <div 
                  className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => {
                    setFilter('completed');
                    setShowViewMenu(false);
                  }}
                >
                  {filter === 'completed' && '✓ '}<span className="underline">C</span>ompleted Tasks
                </div>
                <div className="h-px bg-[#808080] my-1 mx-1"></div>
                <div 
                  className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => {
                    setFilter('high');
                    setShowViewMenu(false);
                  }}
                >
                  {filter === 'high' && '✓ '}<span className="underline">H</span>igh Priority
                </div>
                <div className="h-px bg-[#808080] my-1 mx-1"></div>
                <div 
                  className="px-4 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => {
                    setShowNews(true);
                    setShowViewMenu(false);
                  }}
                >
                  📰 <span className="underline">N</span>ews
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div 
              className="px-2 hover:bg-[#000080] hover:text-white cursor-pointer"
              onClick={() => {
                setShowCalculator(true);
              }}
            >
              🧮 <span className="underline">T</span>ools
            </div>
          </div>
          
          <div 
            className="px-2 hover:bg-[#000080] hover:text-white cursor-pointer"
            onClick={() => {
              setShowAbout(true);
              setShowFileMenu(false);
              setShowEditMenu(false);
              setShowViewMenu(false);
            }}
          >
            <span className="underline">H</span>elp
          </div>
        </div>

        <div className="p-2 flex-1 flex flex-col overflow-hidden">
          <div className="mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search tasks..."
              className="w-full px-2 py-1 win98-inset bg-white text-sm"
            />
          </div>

          <div className="mb-2">
            <div className="flex gap-2 mb-1">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="Enter new task..."
                className="flex-1 px-2 py-1 win98-inset bg-white text-sm"
              />
              <button
                onClick={addTodo}
                className="px-4 py-1 bg-[#c0c0c0] win98-button text-sm hover:bg-[#d4d4d4]"
              >
                Add
              </button>
            </div>
            <div className="flex gap-2">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="px-2 py-1 win98-inset bg-white text-sm"
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="px-2 py-1 win98-inset bg-white text-sm"
              />
            </div>
          </div>

          <div className="win98-inset bg-white p-2 mb-2 flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            {sortedTodos.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-8">
                {searchQuery ? 'No matching tasks found!' : 'No tasks yet. Add one above!'}
              </div>
            ) : (
              <div className="space-y-1">
                {sortedTodos.map(todo => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-2 p-1 hover:bg-[#000080] hover:text-white group border-b border-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{getPrioritySymbol(todo.priority)}</span>
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                        className="flex-1 px-1 py-0.5 text-sm bg-white text-black"
                        autoFocus
                      />
                    ) : (
                      <span className={`flex-1 text-sm ${todo.completed ? 'line-through' : ''} ${getPriorityColor(todo.priority)}`}>
                        {todo.text}
                        {todo.dueDate && (
                          <span className="text-xs text-gray-600 ml-2">📅 {todo.dueDate}</span>
                        )}
                      </span>
                    )}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      {editingId === todo.id ? (
                        <button
                          onClick={() => saveEdit(todo.id)}
                          className="px-2 bg-[#c0c0c0] win98-button text-xs"
                        >
                          Save
                          </button>
                  ) : (
                    <button
                      onClick={() => startEdit(todo)}
                      className="px-2 bg-[#c0c0c0] win98-button text-xs"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-2 bg-[#c0c0c0] win98-button text-xs"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={clearCompleted}
          className="px-3 py-1 bg-[#c0c0c0] win98-button text-sm hover:bg-[#d4d4d4]"
        >
          Clear Completed
        </button>
        <div className="flex-1"></div>
        <div className="text-xs text-gray-700 px-2 py-1">
          {todos.filter(t => !t.completed).length} active | {todos.filter(t => t.completed).length} completed
        </div>
      </div>
    </div>

    <div className="bg-[#c0c0c0] border-t-2 border-white px-1 py-0.5 flex items-center gap-1">
      <div className="win98-inset px-2 py-0.5 text-xs flex-1">
        Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)} | Made with 💞 by Vamerlen Madoucha
      </div>
      <div className="win98-inset px-2 py-0.5 text-xs">
        {todos.length} total tasks
      </div>
    </div>
  </div>

  {/* Calculator Window */}
  {showCalculator && (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#c0c0c0] win98-border w-64">
        <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-1 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xl">🧮</span>
            <span className="text-white text-sm font-bold">Calculator</span>
          </div>
          <button
            className="title-button bg-[#c0c0c0] win98-border hover:bg-[#d4d4d4]"
            onClick={() => setShowCalculator(false)}
          >
            ×
          </button>
        </div>
        
        <div className="p-2">
          <div className="win98-inset bg-white p-2 mb-2 text-right text-lg font-mono">
            {calcDisplay}
          </div>
          
          <div className="grid grid-cols-4 gap-1">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(btn => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn)}
                className="px-3 py-2 bg-[#c0c0c0] win98-button text-sm hover:bg-[#d4d4d4]"
              >
                {btn}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handleCalcClick('C')}
            className="w-full mt-1 px-3 py-2 bg-[#c0c0c0] win98-button text-sm hover:bg-[#d4d4d4]"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )}

  {/* News Window */}
  {showNews && (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#c0c0c0] win98-border w-[500px] h-[450px] flex flex-col">
        <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-1 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xl">📰</span>
            <span className="text-white text-sm font-bold">Tech News</span>
          </div>
          <button
            className="title-button bg-[#c0c0c0] win98-border hover:bg-[#d4d4d4]"
            onClick={() => setShowNews(false)}
          >
            ×
          </button>
        </div>
        
        <div className="p-2 flex-1 flex flex-col overflow-hidden">
          <div className="flex gap-2 mb-2">
            <button
              onClick={fetchNews}
              className="px-3 py-1 bg-[#c0c0c0] win98-button text-sm hover:bg-[#d4d4d4]"
              disabled={loadingNews}
            >
              {loadingNews ? 'Loading...' : '🔄 Refresh'}
            </button>
            <div className="text-xs text-gray-600 flex items-center">
              Live tech news from around the web
            </div>
          </div>

          <div className="win98-inset bg-white p-2 flex-1 overflow-y-auto">
            {loadingNews ? (
              <div className="text-center py-8 text-sm text-gray-600">📡 Loading news...</div>
            ) : newsArticles.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-600">No news available</div>
            ) : (
              <div className="space-y-3">
                {newsArticles.map((article, index) => (
                  <div key={article.id || index} className="border-b border-gray-300 pb-3 hover:bg-gray-50 p-1">
                    <div className="font-bold text-sm mb-1">{article.title}</div>
                    <div className="text-xs text-gray-700 mb-1">{article.description}</div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>📌 {article.source || 'Unknown Source'}</span>
                      <span>📅 {article.date || new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#c0c0c0] border-t-2 border-white px-1 py-0.5">
          <div className="win98-inset px-2 py-0.5 text-xs">
            {newsArticles.length} articles loaded
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Easter Egg Windows */}
  {showEasterEgg && (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#c0c0c0] win98-border w-96">
        <div className={`px-1 py-0.5 flex items-center justify-between ${easterEggType === 'konami' ? 'rainbow' : 'bg-gradient-to-r from-[#000080] to-[#1084d0]'}`}>
          <span className="text-white text-sm font-bold">
            {easterEggType === 'konami' && '🎮 Konami Code Activated!'}
            {easterEggType === 'clippy' && '📎 Hey! It looks like you\'re organizing tasks!'}
            {easterEggType === 'retro' && '💾 Retro Mode Unlocked!'}
            {easterEggType === 'secret' && '🎉 Secret Menu Discovered!'}
            {easterEggType === 'task' && '🔍 Easter Egg Task Found!'}
          </span>
          <button
            className="title-button bg-[#c0c0c0] win98-border hover:bg-[#d4d4d4]"
            onClick={() => setShowEasterEgg(false)}
          >
            ×
          </button>
        </div>
        
        <div className="p-4 text-center">
          {easterEggType === 'konami' && (
            <>
              <div className="text-6xl mb-4 bounce">🎮</div>
              <div className="text-lg font-bold mb-2">You found the Konami Code!</div>
              <div className="text-sm mb-4">↑↑↓↓←→←→BA - Classic!</div>
              <div className="text-xs text-gray-700">
                You've unlocked unlimited productivity power! (Just kidding, but you're awesome!)
              </div>
            </>
          )}
          
          {easterEggType === 'clippy' && (
            <>
              <div className="text-6xl mb-4">📎</div>
              <div className="text-lg font-bold mb-2">Clippy Says Hello!</div>
              <div className="text-sm mb-4 italic">
                "It looks like you're writing a TODO list. Would you like help with that?"
              </div>
              <div className="text-xs text-gray-700">
                Remember me from Microsoft Office? Good times! 😊
              </div>
            </>
          )}
          
          {easterEggType === 'retro' && (
            <>
              <div className="text-6xl mb-4">💾</div>
              <div className="text-lg font-bold mb-2">Retro Mode Activated!</div>
              <div className="text-sm mb-4">
                Welcome back to 1998! Where floppy disks ruled and dial-up was king.
              </div>
              <div className="text-xs text-gray-700 font-mono">
                &gt; LOAD "*",8,1<br/>
                READY.
              </div>
            </>
          )}
          
          {easterEggType === 'secret' && (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-lg font-bold mb-2">You Found the Secret!</div>
              <div className="text-sm mb-4">
                You clicked the title bar 10 times! Here's your reward:
              </div>
              <div className="text-xs text-gray-700">
                🏆 Achievement Unlocked: "The Persistent Clicker"<br/>
                <br/>
                Pro tip: Try typing "clippy" or "retro" or use the Konami code! ↑↑↓↓←→←→BA
              </div>
            </>
          )}
          
          {easterEggType === 'task' && (
            <>
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-lg font-bold mb-2">Secret Task Detected!</div>
              <div className="text-sm mb-4">
                You added a task with the word "secret" in it!
              </div>
              <div className="text-xs text-gray-700">
                🎯 Easter Egg Hunter Badge Earned!<br/>
                Keep exploring for more surprises!
              </div>
            </>
          )}
          
          <button
            onClick={() => setShowEasterEgg(false)}
            className="mt-4 px-8 py-1.5 bg-[#c0c0c0] win98-button text-sm hover:bg-[#d4d4d4]"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  )}

  {/* About Dialog */}
  {showAbout && (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#c0c0c0] win98-border w-96">
        <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-1 py-0.5 flex items-center justify-between">
          <span className="text-white text-sm font-bold">About TODO List</span>
          <button
            className="title-button bg-[#c0c0c0] win98-border hover:bg-[#d4d4d4]"
            onClick={() => setShowAbout(false)}
          >
            ×
          </button>
        </div>
        <div className="flex">
          <div className="w-24 bg-gradient-to-b from-teal-600 via-teal-700 to-teal-800 flex items-center justify-center p-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-transparent"></div>
            <div className="text-white text-center relative z-10">
              <div className="text-5xl mb-1 font-bold drop-shadow-lg">📝</div>
              <div className="text-2xl font-bold tracking-wider mb-0.5">TODO</div>
              <div className="text-xs tracking-widest opacity-90">LIST</div>
            </div>
          </div>
          <div className="flex-1 p-4 bg-[#c0c0c0]">
            <div className="text-lg font-bold mb-1">TODO List™</div>
            <div className="text-xs mb-3">Version 4.5b1 [en]-98194</div>
            <div className="text-xs mb-2 leading-relaxed">
              Copyright © 2025 Vamerlen Madoucha💞 All rights reserved.
            </div>
            <div className="text-xs text-gray-700 mb-2 leading-relaxed">
              This software is subject to the license agreement set forth in the <span className="text-blue-700 underline cursor-pointer">license</span>. Please read and agree to all terms before using this software.
            </div>
            <div className="text-xs text-gray-700 mb-3 leading-relaxed">
              TODO List and TODO List Organizer are trademarks of Vamerlen Madoucha registered in the U.S. and other countries.
            </div>
            <div className="text-xs text-gray-600 mb-3">
              🎁 Easter Eggs: Click title 10x, type "clippy", "retro", or use Konami code!
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="px-8 py-1.5 bg-[#c0c0c0] win98-button text-sm hover:bg-[#d4d4d4] block mx-auto"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
};

// Render using ReactDOM (React 18)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Win98Todo));