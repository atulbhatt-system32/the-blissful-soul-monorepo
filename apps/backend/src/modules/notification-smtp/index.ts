import { Module } from "@medusajs/framework/utils"
import SmtpNotificationService from "./services/smtp"

export default Module("notification-smtp", {
  service: SmtpNotificationService,
})
