/**
 * Agent 系统统一导出 - 分层架构
 * 
 * 架构分层:
 * - core/        Agent核心逻辑 (AgentOrchestrator, SkillRouter)
 * - memory/      记忆系统 (ContextManager)
 * - skills/      技能层 (Registry + Implementations)
 * - utils/       工具函数
 * 
 * 使用方式:
 * import { agentOrchestrator, contextManager } from '@/views/slide-page/agents'
 * 
 * const result = await agentOrchestrator.handleUserRequest(userInput, context)
 */

// Core: Agent 核心
export { agentOrchestrator } from './core/AgentOrchestrator'

// Memory: 记忆管理
export { contextManager } from './memory/ContextManager'
export type { ConversationMessage, SlideContext, WorkingContext } from './memory/ContextManager'

// Skills: 技能注册与定义
export { skillRegistry } from './skills/SkillRegistry'
export type { Skill, SkillMetadata, SkillParams, SkillResult } from './skills/SkillRegistry'
