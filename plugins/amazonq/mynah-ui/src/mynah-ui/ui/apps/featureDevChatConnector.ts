/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatItem, ChatItemAction, ChatItemType, FeedbackPayload } from '@aws/mynah-ui-chat'
import { ExtensionMessage } from '../commands'
import { TabType, TabsStorage } from '../storages/tabsStorage'
import { CodeReference } from './amazonqCommonsConnector'
import { FollowUpGenerator } from '../followUps/generator'
import { getActions } from '../diffTree/actions'
import { DiffTreeFileInfo } from '../diffTree/types'

interface ChatPayload {
    chatMessage: string
}

export interface ConnectorProps {
    sendMessageToExtension: (message: ExtensionMessage) => void
    onMessageReceived?: (tabID: string, messageData: any, needToShowAPIDocsTab: boolean) => void
    onAsyncEventProgress: (tabID: string, inProgress: boolean, message: string, cancelButtonWhenLoading?: boolean) => void
    onChatAnswerReceived?: (tabID: string, message: ChatItem) => void
    onChatAnswerUpdated?: (tabID: string, message: ChatItem) => void
    sendFeedback?: (tabId: string, feedbackPayload: FeedbackPayload) => void | undefined
    onError: (tabID: string, message: string, title: string) => void
    onWarning: (tabID: string, message: string, title: string) => void
    onUpdatePlaceholder: (tabID: string, newPlaceholder: string) => void
    onChatInputEnabled: (tabID: string, enabled: boolean) => void
    onUpdateAuthentication: (
        featureDevEnabled: boolean,
        codeTransformEnabled: boolean,
        docEnabled: boolean,
        codeScanEnabled: boolean,
        codeTestEnabled: boolean,
        authenticatingTabIDs: string[]
    ) => void
    onNewTab: (tabType: TabType) => void
    tabsStorage: TabsStorage
    onFileComponentUpdate: (tabID: string, filePaths: DiffTreeFileInfo[], deletedFiles: DiffTreeFileInfo[], messageId: string, disableFileActions: boolean) => void
}

export class Connector {
    private readonly sendMessageToExtension
    private readonly onError
    private readonly onWarning
    private readonly onChatAnswerReceived
    private readonly onChatAnswerUpdated
    private readonly onAsyncEventProgress
    private readonly updatePlaceholder
    private readonly chatInputEnabled
    private readonly onUpdateAuthentication
    private readonly followUpGenerator: FollowUpGenerator
    private readonly onNewTab
    private readonly onFileComponentUpdate

    constructor(props: ConnectorProps) {
        this.sendMessageToExtension = props.sendMessageToExtension
        this.onChatAnswerReceived = props.onChatAnswerReceived
        this.onChatAnswerUpdated = props.onChatAnswerUpdated
        this.onWarning = props.onWarning
        this.onError = props.onError
        this.onAsyncEventProgress = props.onAsyncEventProgress
        this.updatePlaceholder = props.onUpdatePlaceholder
        this.chatInputEnabled = props.onChatInputEnabled
        this.onUpdateAuthentication = props.onUpdateAuthentication
        this.followUpGenerator = new FollowUpGenerator()
        this.onNewTab = props.onNewTab
        this.onFileComponentUpdate = props.onFileComponentUpdate
    }

    onCodeInsertToCursorPosition = (
        tabID: string,
        code?: string,
        type?: 'selection' | 'block',
        codeReference?: CodeReference[]
    ): void => {
        this.sendMessageToExtension({
            tabID: tabID,
            code,
            command: 'insert_code_at_cursor_position',
            codeReference,
            tabType: 'featuredev',
        })
    }

    onCopyCodeToClipboard = (
        tabID: string,
        code?: string,
        type?: 'selection' | 'block',
        codeReference?: CodeReference[]
    ): void => {
        this.sendMessageToExtension({
            tabID: tabID,
            code,
            command: 'code_was_copied_to_clipboard',
            codeReference,
            tabType: 'featuredev',
        })
    }

    onOpenDiff = (tabID: string, filePath: string, deleted: boolean): void => {
        this.sendMessageToExtension({
            command: 'open-diff',
            tabID,
            filePath,
            deleted,
            tabType: 'featuredev',
        })
    }

    followUpClicked = (tabID: string, followUp: ChatItemAction): void => {
        this.sendMessageToExtension({
            command: 'follow-up-was-clicked',
            followUp,
            tabID,
            tabType: 'featuredev',
        })
    }

    requestGenerativeAIAnswer = (tabID: string, payload: ChatPayload): Promise<any> =>
        new Promise((resolve, reject) => {
            this.sendMessageToExtension({
                tabID: tabID,
                command: 'chat-prompt',
                chatMessage: payload.chatMessage,
                tabType: 'featuredev',
            })
        })

    onFileActionClick = (tabID: string, messageId: string, filePath: string, actionName: string): void => {
        this.sendMessageToExtension({
            command: 'file-click',
            tabID,
            messageId,
            filePath,
            actionName,
            tabType: 'featuredev',
        })
    }

    private processChatMessage = async (messageData: any): Promise<void> => {
        if (this.onChatAnswerReceived !== undefined) {
            const answer: ChatItem = this.createAnswer(messageData)
            this.onChatAnswerReceived(messageData.tabID, answer)
        }
    }

    private processCodeResultMessage = async (messageData: any): Promise<void> => {
        if (this.onChatAnswerReceived !== undefined) {
            const messageId = messageData.messageId ?? messageData.messageID ?? messageData.triggerID ?? messageData.conversationID ?? messageData.codeGenerationId
            this.sendMessageToExtension({ command: 'store-code-result-message-id', tabID: messageData.tabID, messageId, tabType: 'featuredev' })
            const actions = getActions([
                ...messageData.filePaths,
                ...messageData.deletedFiles,
            ])
            const answer: ChatItem = {
                type: ChatItemType.ANSWER,
                relatedContent: undefined,
                followUp: undefined,
                canBeVoted: true,
                codeReference: messageData.references,
                // TODO get the backend to store a message id in addition to conversationID
                messageId,
                fileList: {
                    rootFolderTitle: 'Changes',
                    filePaths: (messageData.filePaths as DiffTreeFileInfo[]).map(path => path.zipFilePath),
                    deletedFiles: (messageData.deletedFiles as DiffTreeFileInfo[]).map(path => path.zipFilePath),
                    actions,
                },
                body: '',
            }
            this.onChatAnswerReceived(messageData.tabID, answer)
        }
    }

    private processAuthNeededException = async (messageData: any): Promise<void> => {
        if (this.onChatAnswerReceived === undefined) {
            return
        }

        this.onChatAnswerReceived(messageData.tabID, {
            type: ChatItemType.ANSWER,
            body: messageData.message,
            followUp: undefined,
            canBeVoted: false,
        })

        this.onChatAnswerReceived(messageData.tabID, {
            type: ChatItemType.SYSTEM_PROMPT,
            body: undefined,
            followUp: this.followUpGenerator.generateAuthFollowUps('featuredev', messageData.authType),
            canBeVoted: false,
        })

        return
    }

    private createAnswer = (messageData: any): ChatItem => {
        return {
            type: messageData.messageType,
            body: messageData.message ?? undefined,
            messageId: messageData.messageId ?? messageData.messageID ?? messageData.triggerID ?? '',
            relatedContent: undefined,
            canBeVoted: messageData.canBeVoted ?? undefined,
            snapToTop: messageData.snapToTop ?? undefined,
            informationCard: messageData.informationCard ?? undefined,
            followUp:
                messageData.followUps !== undefined && Array.isArray(messageData.followUps)
                    ? {
                        text:
                            messageData.messageType === ChatItemType.SYSTEM_PROMPT ||
                            messageData.followUps.length === 0
                                ? ''
                                : 'Please follow up with one of these',
                        options: messageData.followUps,
                    }
                    : undefined,
        }
    }

    handleMessageReceive = async (messageData: any): Promise<void> => {
        if (messageData.type === 'updateFileComponent') {
            this.onFileComponentUpdate(messageData.tabID, messageData.filePaths, messageData.deletedFiles, messageData.messageId, messageData.disableFileActions)
            return
        }
        if (messageData.type === 'updateChatAnswer') {
            const answer = this.createAnswer(messageData)
            this.onChatAnswerUpdated?.(messageData.tabID, answer)
            return
        }
        if (messageData.type === 'errorMessage') {
            this.onError(messageData.tabID, messageData.message, messageData.title)
            return
        }

        if (messageData.type === 'showInvalidTokenNotification') {
            this.onWarning(messageData.tabID, messageData.message, messageData.title)
            return
        }

        if (messageData.type === 'chatMessage') {
            await this.processChatMessage(messageData)
            return
        }

        if (messageData.type === 'codeResultMessage') {
            await this.processCodeResultMessage(messageData)
            return
        }

        if (messageData.type === 'asyncEventProgressMessage') {
            this.onAsyncEventProgress(messageData.tabID, messageData.inProgress, messageData.message ?? undefined, true)
            return
        }

        if (messageData.type === 'updatePlaceholderMessage') {
            this.updatePlaceholder(messageData.tabID, messageData.newPlaceholder)
            return
        }

        if (messageData.type === 'chatInputEnabledMessage') {
            this.chatInputEnabled(messageData.tabID, messageData.enabled)
            return
        }

        if (messageData.type === 'authenticationUpdateMessage') {
            this.onUpdateAuthentication(
                messageData.featureDevEnabled,
                messageData.codeTransformEnabled,
                messageData.docEnabled,
                messageData.codeScanEnabled,
                messageData.codeTestEnabled,
                messageData.authenticatingTabIDs
            )
            return
        }

        if (messageData.type === 'authNeededException') {
            this.processAuthNeededException(messageData)
            return
        }

        if (messageData.type === 'openNewTabMessage') {
            this.onNewTab('featuredev')
            return
        }
    }

    onStopChatResponse = (tabID: string): void => {
        this.sendMessageToExtension({
            tabID: tabID,
            command: 'stop-response',
            tabType: 'featuredev',
        })
    }

    onTabOpen = (tabID: string): void => {
        this.sendMessageToExtension({
            tabID,
            command: 'new-tab-was-created',
            tabType: 'featuredev',
        })
    }

    onTabRemove = (tabID: string): void => {
        this.sendMessageToExtension({
            tabID: tabID,
            command: 'tab-was-removed',
            tabType: 'featuredev',
        })
    }

    sendFeedback = (tabId: string, feedbackPayload: FeedbackPayload): void | undefined => {
        this.sendMessageToExtension({
            command: 'chat-item-feedback',
            ...feedbackPayload,
            tabType: 'featuredev',
            tabID: tabId,
        })
    }

    onChatItemVoted = (tabId: string, messageId: string, vote: string): void | undefined => {
        this.sendMessageToExtension({
            tabID: tabId,
            messageId: messageId,
            vote: vote,
            command: 'chat-item-voted',
            tabType: 'featuredev',
        })
    }

    onResponseBodyLinkClick = (tabID: string, messageId: string, link: string): void => {
        this.sendMessageToExtension({
            command: 'response-body-link-click',
            tabID,
            messageId,
            link,
            tabType: 'featuredev',
        })
    }
}
