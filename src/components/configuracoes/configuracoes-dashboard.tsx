"use client";

import { useState } from "react";
import {
  Shield,
  Bell,
  UserPlus,
  TrashBinMinimalistic,
  Pen2,
} from "@solar-icons/react";
import {
  MOCK_USUARIOS,
  ROLE_PERMISSIONS,
  type Usuario,
  type UserRole,
} from "@/lib/mock-data";

/* ── Tabs ── */
type TabId = "usuarios" | "permissoes" | "alertas" | "geral";

const TABS: { id: TabId; label: string }[] = [
  { id: "usuarios", label: "Usuários" },
  { id: "permissoes", label: "Permissões" },
  { id: "alertas", label: "Alertas" },
  { id: "geral", label: "Geral" },
];

/* ── Role badge color ── */
function roleBadge(role: UserRole) {
  const map: Record<UserRole, string> = {
    Admin: "bg-purple-500/20 text-purple-400",
    Editor: "bg-blue-500/20 text-blue-400",
    Visualizador: "bg-gray-500/20 text-gray-400",
  };
  return map[role];
}

/* ── New User Modal ── */
function NewUserModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Novo Usuário</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1">Nome</label>
            <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-foreground/30" placeholder="Nome completo" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">E-mail</label>
            <input type="email" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-foreground/30" placeholder="email@gaki.com.br" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Cargo</label>
            <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-foreground/30" placeholder="Ex: Social Media Manager" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Nível de Permissão</label>
            <select className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-foreground/30">
              <option value="Admin">Administrador</option>
              <option value="Editor" selected>Editor</option>
              <option value="Visualizador">Visualizador</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted hover:bg-white/5 transition-colors">
            Cancelar
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
            Convidar Usuário
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ConfiguracoesDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("usuarios");
  const [usuarios, setUsuarios] = useState<Usuario[]>(MOCK_USUARIOS);
  const [showNewUser, setShowNewUser] = useState(false);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gradient">Configurações</h1>
        <p className="text-sm text-muted mt-1">Gerencie usuários, permissões e preferências do sistema.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-surface border border-border text-foreground"
                : "text-muted hover:text-foreground hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "usuarios" && (
        <UsersTab
          usuarios={usuarios}
          setUsuarios={setUsuarios}
          onNewUser={() => setShowNewUser(true)}
        />
      )}
      {activeTab === "permissoes" && <PermissoesTab />}
      {activeTab === "alertas" && (
        <AlertasTab usuarios={usuarios} setUsuarios={setUsuarios} />
      )}
      {activeTab === "geral" && <GeralTab />}

      {/* Modals */}
      {showNewUser && <NewUserModal onClose={() => setShowNewUser(false)} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB: Usuários
   ══════════════════════════════════════════════════════════ */
function UsersTab({
  usuarios,
  setUsuarios,
  onNewUser,
}: {
  usuarios: Usuario[];
  setUsuarios: (u: Usuario[]) => void;
  onNewUser: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>("Editor");

  function handleRoleChange(userId: string, newRole: UserRole) {
    setUsuarios(
      usuarios.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    setEditingId(null);
  }

  function toggleAtivo(userId: string) {
    setUsuarios(
      usuarios.map((u) => (u.id === userId ? { ...u, ativo: !u.ativo } : u))
    );
  }

  return (
    <div className="space-y-4">
      {/* Add User Button */}
      <div className="flex justify-end">
        <button
          onClick={onNewUser}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <UserPlus size={16} />
          Novo Usuário
        </button>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {usuarios.map((user) => (
          <div
            key={user.id}
            className={`bg-surface border border-border rounded-2xl p-5 transition-opacity ${
              !user.ativo ? "opacity-50" : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Avatar + Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center text-sm font-semibold text-foreground shrink-0">
                  {user.nome.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{user.nome}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge(user.role)}`}>
                      {ROLE_PERMISSIONS[user.role].label}
                    </span>
                    {!user.ativo && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium">
                        Inativo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted truncate">{user.email}</p>
                  <p className="text-xs text-muted/60">{user.cargo}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 text-xs text-muted/60 sm:text-right">
                <span>Último acesso: {new Date(user.ultimoAcesso).toLocaleDateString("pt-BR")}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {editingId === user.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as UserRole)}
                      className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none"
                    >
                      <option value="Admin">Administrador</option>
                      <option value="Editor">Editor</option>
                      <option value="Visualizador">Visualizador</option>
                    </select>
                    <button
                      onClick={() => handleRoleChange(user.id, editRole)}
                      className="px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:bg-white/5"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditRole(user.role);
                        setEditingId(user.id);
                      }}
                      className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
                      title="Editar permissão"
                    >
                      <Pen2 size={16} />
                    </button>
                    <button
                      onClick={() => toggleAtivo(user.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.ativo
                          ? "text-muted hover:text-red-400 hover:bg-red-500/10"
                          : "text-green-400 hover:bg-green-500/10"
                      }`}
                      title={user.ativo ? "Desativar" : "Reativar"}
                    >
                      {user.ativo ? <TrashBinMinimalistic size={16} /> : <UserPlus size={16} />}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="bg-surface border border-border rounded-2xl p-4 text-center">
          <p className="text-2xl font-semibold text-foreground">{usuarios.length}</p>
          <p className="text-xs text-muted mt-1">Total de Usuários</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-4 text-center">
          <p className="text-2xl font-semibold text-foreground">
            {usuarios.filter((u) => u.ativo).length}
          </p>
          <p className="text-xs text-muted mt-1">Ativos</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-4 text-center">
          <p className="text-2xl font-semibold text-foreground">
            {usuarios.filter((u) => u.role === "Admin").length}
          </p>
          <p className="text-xs text-muted mt-1">Administradores</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB: Permissões
   ══════════════════════════════════════════════════════════ */
function PermissoesTab() {
  const roles: UserRole[] = ["Admin", "Editor", "Visualizador"];
  const allPermissions = [
    "Gerenciar usuários",
    "Editar configurações",
    "Acessar Saúde",
    "Gerenciar clientes",
    "Gerenciar tarefas",
    "Editar Brand Hub",
    "Visualizar clientes",
    "Visualizar tarefas",
    "Visualizar Brand Hub",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Shield size={20} className="text-purple-400" />
        <div>
          <h2 className="text-base font-semibold text-foreground">Níveis de Permissão</h2>
          <p className="text-xs text-muted">Cada nível define o que o usuário pode acessar e modificar no sistema.</p>
        </div>
      </div>

      {/* Permission Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => {
          const info = ROLE_PERMISSIONS[role];
          return (
            <div key={role} className="bg-surface border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge(role)}`}>
                  {info.label}
                </span>
              </div>
              <p className="text-xs text-muted mb-4">{info.descricao}</p>
              <div className="space-y-2">
                {allPermissions.map((perm) => {
                  const has = info.permissoes.includes(perm);
                  return (
                    <div key={perm} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          has
                            ? "bg-green-500/20 text-green-400"
                            : "bg-white/5 text-muted/30"
                        }`}
                      >
                        {has ? "✓" : "—"}
                      </div>
                      <span className={`text-xs ${has ? "text-foreground" : "text-muted/40"}`}>
                        {perm}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-surface border border-border rounded-2xl p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-foreground mb-4">Matriz de Permissões</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted font-medium">Módulo</th>
              {roles.map((r) => (
                <th key={r} className="text-center py-2 px-3 text-muted font-medium">
                  {ROLE_PERMISSIONS[r].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { modulo: "Home", perms: ["Completo", "Completo", "Leitura"] },
              { modulo: "Clientes", perms: ["Completo", "Editar", "Leitura"] },
              { modulo: "Tarefas", perms: ["Completo", "Editar", "Leitura"] },
              { modulo: "Brand Hub", perms: ["Completo", "Editar", "Leitura"] },
              { modulo: "Saúde", perms: ["Completo", "Bloqueado", "Bloqueado"] },
              { modulo: "Configurações", perms: ["Completo", "Bloqueado", "Bloqueado"] },
            ].map((row) => (
              <tr key={row.modulo} className="border-b border-border/50">
                <td className="py-2.5 pr-4 text-foreground font-medium">{row.modulo}</td>
                {row.perms.map((perm, i) => {
                  const color =
                    perm === "Completo"
                      ? "text-green-400"
                      : perm === "Editar"
                      ? "text-blue-400"
                      : perm === "Leitura"
                      ? "text-yellow-400"
                      : "text-red-400";
                  return (
                    <td key={i} className={`text-center py-2.5 px-3 ${color}`}>
                      {perm}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB: Alertas
   ══════════════════════════════════════════════════════════ */
function AlertasTab({
  usuarios,
  setUsuarios,
}: {
  usuarios: Usuario[];
  setUsuarios: (u: Usuario[]) => void;
}) {
  function toggleAlerta(userId: string, key: keyof Usuario["alertas"]) {
    setUsuarios(
      usuarios.map((u) =>
        u.id === userId
          ? { ...u, alertas: { ...u.alertas, [key]: !u.alertas[key] } }
          : u
      )
    );
  }

  const alertTypes: { key: keyof Usuario["alertas"]; label: string; descricao: string }[] = [
    { key: "tarefasAtrasadas", label: "Tarefas Atrasadas", descricao: "Notificar quando uma tarefa passar do prazo." },
    { key: "renovacaoContratos", label: "Renovação de Contratos", descricao: "Alerta 30 dias antes do vencimento." },
    { key: "pagamentosPendentes", label: "Pagamentos Pendentes", descricao: "Notificar sobre pagamentos não confirmados." },
    { key: "novosComentarios", label: "Novos Comentários", descricao: "Alerta ao receber comentário em tarefa atribuída." },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Bell size={20} className="text-yellow-400" />
        <div>
          <h2 className="text-base font-semibold text-foreground">Configuração de Alertas</h2>
          <p className="text-xs text-muted">Personalize as notificações para cada usuário.</p>
        </div>
      </div>

      {usuarios.map((user) => (
        <div key={user.id} className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center text-xs font-semibold text-foreground">
              {user.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{user.nome}</p>
              <p className="text-xs text-muted">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            {alertTypes.map((alert) => (
              <div
                key={alert.key}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div>
                  <p className="text-sm text-foreground">{alert.label}</p>
                  <p className="text-xs text-muted/60">{alert.descricao}</p>
                </div>
                <button
                  onClick={() => toggleAlerta(user.id, alert.key)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    user.alertas[alert.key] ? "bg-green-500" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      user.alertas[alert.key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB: Geral
   ══════════════════════════════════════════════════════════ */
function GeralTab() {
  return (
    <div className="space-y-6">
      {/* Agency Info */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Dados da Agência</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-muted mb-1">Nome da Agência</label>
            <input
              type="text"
              defaultValue="Gaki Marketing Digital"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-foreground/30"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">CNPJ</label>
            <input
              type="text"
              defaultValue="00.000.000/0001-00"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-foreground/30"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">E-mail Principal</label>
            <input
              type="email"
              defaultValue="contato@gaki.com.br"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-foreground/30"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Telefone</label>
            <input
              type="text"
              defaultValue="(11) 99999-0000"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-foreground/30"
            />
          </div>
        </div>
        <button className="mt-4 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
          Salvar Alterações
        </button>
      </div>

      {/* System Preferences */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Preferências do Sistema</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div>
              <p className="text-sm text-foreground">Moeda padrão</p>
              <p className="text-xs text-muted/60">Utilizada no módulo Saúde e contratos.</p>
            </div>
            <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none">
              <option>BRL (R$)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div>
              <p className="text-sm text-foreground">Fuso horário</p>
              <p className="text-xs text-muted/60">Usado para prazos e alertas.</p>
            </div>
            <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none">
              <option>América/São Paulo (BRT)</option>
              <option>América/Manaus (AMT)</option>
              <option>UTC</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-foreground">Alerta de renovação</p>
              <p className="text-xs text-muted/60">Dias de antecedência para alertas de contrato.</p>
            </div>
            <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none">
              <option>15 dias</option>
              <option selected>30 dias</option>
              <option>45 dias</option>
              <option>60 dias</option>
            </select>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Sobre o Naka OS</h3>
        <div className="space-y-2 text-xs text-muted">
          <p><span className="text-foreground font-medium">Versão:</span> 1.0.0</p>
          <p><span className="text-foreground font-medium">Build:</span> Next.js 16 + Tailwind CSS v4</p>
          <p><span className="text-foreground font-medium">Backend:</span> Rocket.new</p>
          <p><span className="text-foreground font-medium">Deploy:</span> Vercel</p>
          <p className="pt-2 text-muted/40">Desenvolvido para Gaki Marketing Digital</p>
        </div>
      </div>
    </div>
  );
}
