// src/App.jsx
import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./api/categories";

import {
  fetchTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "./api/transactions";

import { fetchIncomes, createIncome, deleteIncome } from "./api/incomes";

import { fetchNetWorth } from "./api/netWorth";

import Navbar from "./components/Navbar";
import SummaryCard from "./components/SummaryCard";
import AddCategoryForm from "./components/AddCategoryForm";
import CategoriesTable from "./components/CategoriesTable";
import SavingsBreakdown from "./components/SavingsBreakdown";
import TransactionsPanel from "./pages/TransactionsPanel";
import IncomePanel from "./pages/IncomePanel";
import YearlyBreakdown from "./pages/YearlyBreakdown";
import MonthlyBreakdown from "./pages/MonthlyBreakdown";
import ToastAlert from "./components/ToastAlert";
import NetWorthChart from "./components/NetWorthChart";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/SettingsPage";

import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import { usePersistedMonth } from "./hooks/usePersistedMonth";
import { useRouteScrollMemory } from "./hooks/useRouteScrollMemory";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Theme + accent
  const [theme, setTheme] = useState("light"); // 'light' | 'dark'
  const [accent, setAccent] = useState("primary"); // bootstrap color variant

  // Auth state
  const [user, setUser] = useState(null); // { id, email, name } or null

  // Month / data
  const [selectedMonth, setSelectedMonth] = usePersistedMonth();

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [netWorthData, setNetWorthData] = useState([]);
  const [netWorthLoading, setNetWorthLoading] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add-category form
  const [newName, setNewName] = useState("");
  const [newBudget, setNewBudget] = useState("");

  // Toast state
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  // ---- Toast helper ----
  function showToast(message, variant = "success") {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, variant });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  // ---- Auth helpers ----

  // Called from login/register pages
  function handleAuthSuccess(data, rememberMe = true) {
    const { token, user } = data;

    // Always store in sessionStorage for this tab/session
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));

    if (rememberMe) {
      // Persist across browser restarts
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // Ensure no persistent token if user unchecked Remember me
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setUser(user);
    showToast("Signed in successfully", "success");
    navigate("/");
  }

  // Logout
  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCategories([]);
    setTransactions([]);
    setIncomes([]);
    setNetWorthData([]);
    showToast("Logged out", "info");
    navigate("/login");
  }

  // Bootstraps auth/session and restores last route
  useAuthBootstrap(setUser, navigate);

  // Restore per-route scroll positions
  useRouteScrollMemory(location);

  // Persist theme/accent
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("accent", accent);
  }, [accent]);

  // Apply theme to body
  useEffect(() => {
    document.body.classList.remove(
      "bg-dark",
      "text-light",
      "bg-light",
      "text-dark"
    );
    if (theme === "dark") {
      document.body.classList.add("bg-dark", "text-light");
    } else {
      document.body.classList.add("bg-light", "text-dark");
    }
  }, [theme]);

  // Load data whenever month changes and user is logged in
  useEffect(() => {
    if (!user) {
      setCategories([]);
      setTransactions([]);
      setIncomes([]);
      setNetWorthData([]);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError("");
        const [cats, txs, incs] = await Promise.all([
          fetchCategories(selectedMonth),
          fetchTransactions(selectedMonth),
          fetchIncomes(selectedMonth),
        ]);
        setCategories(cats);
        setTransactions(txs);
        setIncomes(incs);
        await refreshNetWorth();
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedMonth, user]);

  async function refreshNetWorth() {
    if (!user) return;
    try {
      setNetWorthLoading(true);
      const data = await fetchNetWorth();
      setNetWorthData(data);
    } catch (err) {
      console.error("Failed to load net worth data", err);
    } finally {
      setNetWorthLoading(false);
    }
  }

  // Derived totals
  const totalBudget = categories.reduce(
    (sum, c) => sum + Number(c.budget || 0),
    0
  );
  const totalSpent = transactions.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );
  const totalIncome = incomes.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0
  );
  const remaining = totalBudget - totalSpent;

  // Spent per category
  const spentByCategory = transactions.reduce((map, t) => {
    const key = t.categoryId;
    map[key] = (map[key] || 0) + Number(t.amount || 0);
    return map;
  }, {});

  // ---------- Category handlers ----------

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setError("");
      const newCat = await createCategory({
        name: newName,
        budget: newBudget,
        month: selectedMonth,
      });
      setCategories((prev) => [...prev, newCat]);
      setNewName("");
      setNewBudget("");
      showToast("Category added", "success");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to add category");
    }
  }

  function handleLocalCategoryChange(id, field, value) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              [field]: field === "name" ? value : Number(value) || 0,
            }
          : c
      )
    );
  }

  async function handleSaveCategory(category) {
    try {
      setError("");
      const updated = await updateCategory(category.id, {
        name: category.name,
        budget: category.budget,
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? updated : c))
      );
      showToast("Category updated", "info");
    } catch (err) {
      console.error(err);
      setError("Failed to save category");
    }
  }

  async function handleDeleteCategory(id) {
    if (!window.confirm("Delete this category and its transactions?")) return;
    try {
      setError("");
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setTransactions((prev) => prev.filter((t) => t.categoryId !== id));
      showToast("Category deleted", "warning");
      await refreshNetWorth();
    } catch (err) {
      console.error(err);
      setError("Failed to delete category");
    }
  }

  // ---------- Transaction handlers ----------

  async function handleAddTransaction(data) {
    try {
      setError("");
      const created = await createTransaction({
        ...data, // categoryId, description, amount, date
      });

      if (created.month === selectedMonth) {
        setTransactions((prev) => [created, ...prev]);
      }
      showToast(`Transaction added (${created.month})`, "success");
      await refreshNetWorth();
    } catch (err) {
      console.error(err);
      setError("Failed to add transaction");
    }
  }

  async function handleDeleteTransaction(id) {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      setError("");
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast("Transaction deleted", "warning");
      await refreshNetWorth();
    } catch (err) {
      console.error(err);
      setError("Failed to delete transaction");
    }
  }

  async function handleUpdateTransaction(id, data) {
    try {
      setError("");
      const updated = await updateTransaction(id, data);
      setTransactions((prev) =>
        prev
          .map((t) => (t.id === id ? updated : t))
          .filter((t) => t.month === selectedMonth)
      );
      showToast("Transaction updated", "info");
      await refreshNetWorth();
    } catch (err) {
      console.error(err);
      setError("Failed to update transaction");
    }
  }

  // ---------- Income handlers ----------

  async function handleAddIncome(data) {
    try {
      setError("");
      const created = await createIncome(data);
      if (created.month === selectedMonth) {
        setIncomes((prev) => [created, ...prev]);
      }
      showToast(`Income added (${created.month})`, "success");
      await refreshNetWorth();
    } catch (err) {
      console.error(err);
      setError("Failed to add income");
    }
  }

  async function handleDeleteIncome(id) {
    if (!window.confirm("Delete this income entry?")) return;
    try {
      setError("");
      await deleteIncome(id);
      setIncomes((prev) => prev.filter((i) => i.id !== id));
      showToast("Income deleted", "warning");
      await refreshNetWorth();
    } catch (err) {
      console.error(err);
      setError("Failed to delete income");
    }
  }

  // ---- Render ----

  return (
    <div
      className={`min-vh-100 ${
        theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Navbar
        theme={theme}
        accent={accent}
        selectedMonth={selectedMonth}
        onChangeMonth={setSelectedMonth}
        user={user}
        onToggleTheme={() =>
          setTheme((t) => (t === "light" ? "dark" : "light"))
        }
        onLogout={handleLogout}
      />

      <div className="container py-4">
        {/* If not logged in, only show auth routes */}
        {!user ? (
          <Routes>
            <Route
              path="/login"
              element={
                <LoginPage accent={accent} onAuthSuccess={handleAuthSuccess} />
              }
            />
            <Route
              path="/register"
              element={
                <RegisterPage
                  accent={accent}
                  onAuthSuccess={handleAuthSuccess}
                />
              }
            />
            {/* Redirect everything else to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <>
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            <Routes>
              {/* Dashboard */}
              <Route
                path="/"
                element={
                  <>
                    <SummaryCard
                      theme={theme}
                      categories={categories}
                      totalBudget={totalBudget}
                      totalSpent={totalSpent}
                      totalIncome={totalIncome}
                      remaining={remaining}
                    />

                    <AddCategoryForm
                      theme={theme}
                      accent={accent}
                      newName={newName}
                      newBudget={newBudget}
                      onChangeName={setNewName}
                      onChangeBudget={setNewBudget}
                      onSubmit={handleAddCategory}
                    />

                    <CategoriesTable
                      theme={theme}
                      accent={accent}
                      categories={categories}
                      loading={loading}
                      spentByCategory={spentByCategory}
                      onLocalChange={handleLocalCategoryChange}
                      onSave={handleSaveCategory}
                      onDelete={handleDeleteCategory}
                    />

                    <SavingsBreakdown
                      theme={theme}
                      netIncome={totalIncome - totalSpent}
                    />

                    <NetWorthChart
                      theme={theme}
                      data={netWorthData}
                      loading={netWorthLoading}
                    />
                  </>
                }
              />

              {/* Transactions */}
              <Route
                path="/transactions"
                element={
                  <TransactionsPanel
                    theme={theme}
                    accent={accent}
                    categories={categories}
                    transactions={transactions}
                    selectedMonth={selectedMonth}
                    userId={user?.id}
                    onAddTransaction={handleAddTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                    onUpdateTransaction={handleUpdateTransaction}
                  />
                }
              />

              {/* Income */}
              <Route
                path="/income"
                element={
                  <IncomePanel
                    theme={theme}
                    accent={accent}
                    incomes={incomes}
                    selectedMonth={selectedMonth}
                    onAddIncome={handleAddIncome}
                    onDeleteIncome={handleDeleteIncome}
                  />
                }
              />

              <Route
                path="/yearly"
                element={
                  <YearlyBreakdown
                    theme={theme}
                    accent={accent}
                    user={user}
                  />
                }
              />
              <Route
                path="/yearly/:year/:month"
                element={<MonthlyBreakdown theme={theme} />}
              />

              {/* Settings */}
              <Route
                path="/settings"
                element={
                  <SettingsPage
                    theme={theme}
                    accent={accent}
                    onThemeChange={setTheme}
                    onAccentChange={setAccent}
                  />
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        )}
      </div>

      <ToastAlert toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
