"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Shield,
  Bell,
  UserPlus,
  TrashBinMinimalistic,
  Pen2,
} from "@solar-icons/react";
import type { Usuario, UserRole } from "@/lib/types";
import { ROLE_PERMISSIONS } from "@/lib/types";
import {
  updateUserRoleAction,
  toggleUserActiveAction,
} from "@/lib/actions";

/* ── Tabs ── */
type TabId = "usuarios" | "permissoes" | "alertas" | "geral";

const TABS: { id: TabId; label: string }[] = [
  { id: "usuarios", label: "Usuários" },
  { id: "permissoes", label: "Permissões" },
  { id: "alertas", label: "Alertas" },
  { id: "geral", label: "Geral" },
];

/* ── Role badge color ── */
function roleBadge(role: string) {
  const map: Record<string, string> = {
    Admin: "bg-primary-container/20 text-primary",
    Editor: "bg-secondary-container/20 text-secondary",
    Visualizador: "bg-surface-container text-on-surface-variant",
  };
  return map[role] ?? "bg-surface-container text-on-surface-variant";
}

/* ── Main Component ── */
interface ConfiguracoesDashboardProps {
  usuarios: Usuario[];
  currentUserRole: string;
  currentUserId: string;
}

export default function ConfiguracoesDashboard({ usuarios: initialUsuarios, currentUserRole, currentUserId }: ConfiguracoesDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("usuarios");
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  // Sync props when server data changes (after revalidation)
  useEffect(() => {
    setUsuarios(initialUsuarios);
  }, [initialUsuarios]);

  const isAdmin = currentUserRole === "Admin";

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-on-surface">Configurações</h1>
        <p className="text-sm text-on-surface-variant mt-1">Gerencie usuários, permissões e preferências do sistema.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-surface-container-low text-on-surface"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
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
          isAdmin={isAdmin}
          currentUserId={currentUserId}
        />
      )}
      {activeTab === "permissoes" && <PermissoesTab />}
      {activeTab === "alertas" && (
        <AlertasTab usuarios={usuarios} setUsuarios={setUsuarios} />
      )}
      {activeTab === "geral" && <GeralTab />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB: Usuários
   ══════════════════════════════════════════════════════════ */
function UsersTab({
  usuarios,
  isAdmin,
  currentUserId,
}: {
  usuarios: Usuario[];
  isAdmin: boolean;
  currentUserId: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>("Editor");
  const [pending, startTransition] = useTransition();

  function handleRoleChange(userId: string, newRole: string) {
    startTransition(async () => {
      const result = await updateUserRoleAction(userId, newRole);
      if (result.error) {
        alert(result.error);
      }
      setEditingId(null);
    });
  }

  function handleToggleAtivo(userId: string) {
    startTransition(async () => {
      const result = await toggleUserActiveAction(userId);
      if (result.error) {
        alert(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Users List — signup aberto, admin gerencia roles */}
      <div className="space-y-3">
        {usuarios.map((user) => (
          <div
            key={user.id}
            className={`bg-surface-container-low rounded-xl p-5 transition-opacity ${
              !user.ativo ? "opacity-50" : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Avatar + Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                  {user.nome.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-on-surface">{user.nome}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge(user.role)}`}>
                      {ROLE_PERMISSIONS[user.role]?.label ?? user.role}
                    </span>
                    {!user.ativo && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-error/20 text-error font-medium">
                        Inativo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                  <p className="text-xs text-on-surface-variant/60">{user.cargo}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 text-xs text-on-surface-variant/60 sm:text-right">
                <span>
                  {user.ultimoAcesso
                    ? `Último acesso: ${new Date(user.ultimoAcesso).toLocaleDateString("pt-BR")}`
                    : "Nunca acessou"}
                </span>
              </div>

              {/* Actions — Admin only */}
              {isAdmin && (
                <div className="flex items-center gap-2">
                  {editingId === user.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="bg-surface-container-low border-none rounded-xl px-2 py-1.5 text-xs text-on-surface focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none"
                      >
                        <option value="Admin">Administrador</option>
                        <option value="Editor">Editor</option>
                        <option value="Visualizador">Visualizador</option>
                      </select>
                      <button
                        onClick={() => handleRoleChange(user.id, editRole)}
                        disabled={pending}
                        className="px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-full text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all"
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
                        className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                        title="Editar permissão"
                      >
                        <Pen2 size={16} />
                      </button>
                      {user.id !== currentUserId && (
                        <button
                          onClick={() => handleToggleAtivo(user.id)}
                          disabled={pending}
                          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                            user.ativo
                              ? "text-on-surface-variant hover:text-error hover:bg-error/10"
                              : "text-success hover:bg-success/10"
                          }`}
                          title={user.ativo ? "Desativar" : "Reativar"}
                        >
                          {user.ativo ? <TrashBinMinimalistic size={16} /> : <UserPlus size={16} />}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="bg-surface-container-low rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-on-surface">{usuarios.length}</p>
          <p className="text-xs text-on-surface-variant mt-1">Total de Usuários</p>
        </div>
        <div className="bg-surface-container-low rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-on-surface">
            {usuarios.filter((u) => u.ativo).length}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">Ativos</p>
        </div>
        <div className="bg-surface-container-low rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-on-surface">
            {usuarios.filter((u) => u.role === "Admin").length}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">Administradores</p>
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
    "Acessar Finanças",
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
        <Shield size={20} className="text-primary" />
        <div>
          <h2 className="text-base font-semibold text-on-surface">Níveis de Permissão</h2>
          <p className="text-xs text-on-surface-variant">Cada nível define o que o usuário pode acessar e modificar no sistema.</p>
        </div>
      </div>

      {/* Permission Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => {
          const info = ROLE_PERMISSIONS[role];
          return (
            <div key={role} className="bg-surface-container-low rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge(role)}`}>
                  {info.label}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mb-4">{info.descricao}</p>
              <div className="space-y-2">
                {allPermissions.map((perm) => {
                  const has = info.permissoes.includes(perm);
                  return (
                    <div key={perm} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          has
                            ? "bg-success/20 text-success"
                            : "bg-outline-variant/10 text-on-surface-variant/30"
                        }`}
                      >
                        {has ? "✓" : "—"}
                      </div>
                      <span className={`text-xs ${has ? "text-on-surface" : "text-on-surface-variant/40"}`}>
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
      <div className="bg-surface-container-low rounded-xl p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Matriz de Permissões</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="text-left py-2 pr-4 text-on-surface-variant font-medium">Módulo</th>
              {roles.map((r) => (
                <th key={r} className="text-center py-2 px-3 text-on-surface-variant font-medium">
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
              { modulo: "Finanças", perms: ["Completo", "Bloqueado", "Bloqueado"] },
              { modulo: "Configurações", perms: ["Completo", "Bloqueado", "Bloqueado"] },
            ].map((row) => (
              <tr key={row.modulo} className="border-b border-outline-variant/5">
                <td className="py-2.5 pr-4 text-on-surface font-medium">{row.modulo}</td>
                {row.perms.map((perm, i) => {
                  const color =
                    perm === "Completo"
                      ? "text-success"
                      : perm === "Editar"
                      ? "text-secondary"
                      : perm === "Leitura"
                      ? "text-warning"
                      : "text-error";
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
  function toggleAlerta(userId: string, key: string) {
    setUsuarios(
      usuarios.map((u) => {
        if (u.id !== userId || !u.alertas) return u;
        const alertas = u.alertas as Record<string, boolean>;
        return { ...u, alertas: { ...u.alertas, [key]: !alertas[key] } };
      })
    );
  }

  const alertTypes: { key: string; label: string; descricao: string }[] = [
    { key: "tarefasAtrasadas", label: "Tarefas Atrasadas", descricao: "Notificar quando uma tarefa passar do prazo." },
    { key: "renovacaoContratos", label: "Renovação de Contratos", descricao: "Alerta 30 dias antes do vencimento." },
    { key: "pagamentosPendentes", label: "Pagamentos Pendentes", descricao: "Notificar sobre pagamentos não confirmados." },
    { key: "novosComentarios", label: "Novos Comentários", descricao: "Alerta ao receber comentário em tarefa atribuída." },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Bell size={20} className="text-warning" />
        <div>
          <h2 className="text-base font-semibold text-on-surface">Configuração de Alertas</h2>
          <p className="text-xs text-on-surface-variant">Personalize as notificações para cada usuário.</p>
        </div>
      </div>

      {usuarios.map((user) => (
        <div key={user.id} className="bg-surface-container-low rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-xs font-semibold text-on-surface">
              {user.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">{user.nome}</p>
              <p className="text-xs text-on-surface-variant">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            {alertTypes.map((alert) => (
              <div
                key={alert.key}
                className="flex items-center justify-between py-2 border-b border-outline-variant/5 last:border-0"
              >
                <div>
                  <p className="text-sm text-on-surface">{alert.label}</p>
                  <p className="text-xs text-on-surface-variant/60">{alert.descricao}</p>
                </div>
                <button
                  onClick={() => toggleAlerta(user.id, alert.key)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    (user.alertas as Record<string, boolean> | null)?.[alert.key] ? "bg-success" : "bg-outline-variant/10"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      (user.alertas as Record<string, boolean> | null)?.[alert.key] ? "translate-x-5" : "translate-x-0"
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
      <div className="bg-surface-container-low rounded-xl p-5">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Dados da Agência</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1">Nome da Agência</label>
            <input type="text" defaultValue="Gaki Marketing Digital" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1">CNPJ</label>
            <input type="text" defaultValue="00.000.000/0001-00" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1">E-mail Principal</label>
            <input type="email" defaultValue="contato@gaki.com.br" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest block mb-1">Telefone</label>
            <input type="text" defaultValue="(11) 99999-0000" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline/40 focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none" />
          </div>
        </div>
        <button className="mt-4 px-4 py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity">
          Salvar Alterações
        </button>
      </div>

      {/* System Preferences */}
      <div className="bg-surface-container-low rounded-xl p-5">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Preferências do Sistema</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/5">
            <div>
              <p className="text-sm text-on-surface">Moeda padrão</p>
              <p className="text-xs text-on-surface-variant/60">Utilizada no módulo Finanças e contratos.</p>
            </div>
            <select className="bg-surface-container-low border-none rounded-xl px-3 py-1.5 text-sm text-on-surface focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none">
              <option>BRL (R$)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/5">
            <div>
              <p className="text-sm text-on-surface">Fuso horário</p>
              <p className="text-xs text-on-surface-variant/60">Usado para prazos e alertas.</p>
            </div>
            <select className="bg-surface-container-low border-none rounded-xl px-3 py-1.5 text-sm text-on-surface focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none">
              <option>América/São Paulo (BRT)</option>
              <option>América/Manaus (AMT)</option>
              <option>UTC</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-on-surface">Alerta de renovação</p>
              <p className="text-xs text-on-surface-variant/60">Dias de antecedência para alertas de contrato.</p>
            </div>
            <select defaultValue="30 dias" className="bg-surface-container-low border-none rounded-xl px-3 py-1.5 text-sm text-on-surface focus:bg-surface-container-high focus:ring-1 focus:ring-primary transition-all outline-none">
              <option>15 dias</option>
              <option>30 dias</option>
              <option>45 dias</option>
              <option>60 dias</option>
            </select>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="bg-surface-container-low rounded-xl p-5">
        <h3 className="text-sm font-semibold text-on-surface mb-3">Sobre o Naka OS</h3>
        <div className="space-y-2 text-xs text-on-surface-variant">
          <p><span className="text-on-surface font-medium">Versão:</span> 1.0.0</p>
          <p><span className="text-on-surface font-medium">Build:</span> Next.js 16 + Tailwind CSS v4</p>
          <p><span className="text-on-surface font-medium">Database:</span> Neon PostgreSQL</p>
          <p><span className="text-on-surface font-medium">Deploy:</span> Vercel</p>
          <p className="pt-2 text-on-surface-variant/40">Desenvolvido para Gaki Marketing Digital</p>
        </div>
      </div>
    </div>
  );
}
