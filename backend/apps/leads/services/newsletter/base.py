from dataclasses import dataclass
from typing import Protocol


@dataclass
class SubscribeRequest:
    email: str
    locale: str
    name: str = ""
    source: str = ""
    article_slug: str = ""


@dataclass
class SubscribeResult:
    contact_id: str = ""
    list_id: str = ""


@dataclass
class QuestionNotifyRequest:
    name: str
    email: str
    question: str
    article_title: str
    article_slug: str
    locale: str
    page_path: str = ""


@dataclass
class QuestionNotifyResult:
    message_id: str = ""


@dataclass
class InquiryNotifyRequest:
    name: str
    email: str
    message: str
    request_type: str
    locale: str
    page_path: str = ""


@dataclass
class InquiryNotifyResult:
    message_id: str = ""


@dataclass
class ReplyEmailRequest:
    to_email: str
    to_name: str
    subject: str
    html_content: str


@dataclass
class ReplyEmailResult:
    message_id: str = ""


class NewsletterProvider(Protocol):
    def is_configured(self) -> bool: ...

    def subscribe_doi(self, request: SubscribeRequest) -> SubscribeResult: ...

    def is_question_notify_configured(self) -> bool: ...

    def send_question_notification(
        self, request: QuestionNotifyRequest
    ) -> QuestionNotifyResult: ...

    def is_inquiry_notify_configured(self) -> bool: ...

    def send_inquiry_notification(
        self, request: InquiryNotifyRequest
    ) -> InquiryNotifyResult: ...

    def send_reply_email(self, request: ReplyEmailRequest) -> ReplyEmailResult: ...
