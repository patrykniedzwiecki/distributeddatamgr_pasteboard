/*
 * Copyright (C) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#include "paste_data_record.h"
#include "pasteboard_common.h"

using namespace OHOS::Media;

namespace OHOS {
namespace MiscServices {
namespace {
constexpr int MAX_TEXT_LEN = 500 * 1024;
}

PasteDataRecord::Builder &PasteDataRecord::Builder::SetHtmlText(std::shared_ptr<std::string> htmlText)
{
    record_->htmlText_ = std::move(htmlText);
    return *this;
}
PasteDataRecord::Builder &PasteDataRecord::Builder::SetWant(std::shared_ptr<OHOS::AAFwk::Want> want)
{
    record_->want_ = std::move(want);
    return *this;
}
PasteDataRecord::Builder &PasteDataRecord::Builder::SetPlainText(std::shared_ptr<std::string> plainText)
{
    record_->plainText_ = std::move(plainText);
    return *this;
}
PasteDataRecord::Builder &PasteDataRecord::Builder::SetUri(std::shared_ptr<OHOS::Uri> uri)
{
    record_->uri_ = std::move(uri);
    return *this;
}
PasteDataRecord::Builder &PasteDataRecord::Builder::SetPixelMap(std::shared_ptr<OHOS::Media::PixelMap> pixelMap)
{
    record_->pixelMap_ = std::move(pixelMap);
    return *this;
}
std::shared_ptr<PasteDataRecord> PasteDataRecord::Builder::Build()
{
    return record_;
}
PasteDataRecord::Builder::Builder(const std::string &mimeType)
{
    record_ = std::make_shared<PasteDataRecord>();
    if (record_ != nullptr) {
        record_->mimeType_ = mimeType;
        record_->htmlText_ = nullptr;
        record_->want_ = nullptr;
        record_->plainText_ = nullptr;
        record_->uri_ = nullptr;
        record_->pixelMap_ = nullptr;
    }
}

std::shared_ptr<PasteDataRecord> PasteDataRecord::NewHtmlRecord(const std::string &htmlText)
{
    if (htmlText.length() >= MAX_TEXT_LEN) {
        return nullptr;
    }
    return Builder(MIMETYPE_TEXT_HTML).SetHtmlText(std::make_shared<std::string>(htmlText)).Build();
}

std::shared_ptr<PasteDataRecord> PasteDataRecord::NewWantRecord(std::shared_ptr<OHOS::AAFwk::Want> want)
{
    return Builder(MIMETYPE_TEXT_WANT).SetWant(std::move(want)).Build();
}

std::shared_ptr<PasteDataRecord> PasteDataRecord::NewPlaintTextRecord(const std::string &text)
{
    if (text.length() >= MAX_TEXT_LEN) {
        return nullptr;
    }
    return Builder(MIMETYPE_TEXT_PLAIN).SetPlainText(std::make_shared<std::string>(text)).Build();
}

std::shared_ptr<PasteDataRecord> PasteDataRecord::NewPixelMapRecord(std::shared_ptr<PixelMap> pixelMap)
{
    return Builder(MIMETYPE_PIXELMAP).SetPixelMap(std::move(pixelMap)).Build();
}

std::shared_ptr<PasteDataRecord> PasteDataRecord::NewUriRecord(const OHOS::Uri &uri)
{
    return Builder(MIMETYPE_TEXT_URI).SetUri(std::make_shared<OHOS::Uri>(uri)).Build();
}

PasteDataRecord::PasteDataRecord(std::string mimeType,
                                 std::shared_ptr<std::string> htmlText,
                                 std::shared_ptr<OHOS::AAFwk::Want> want,
                                 std::shared_ptr<std::string> plainText,
                                 std::shared_ptr<OHOS::Uri> uri)
    : mimeType_ {std::move(mimeType)},
      htmlText_ {std::move(htmlText)},
      want_ {std::move(want)},
      plainText_ {std::move(plainText)},
      uri_ {std::move(uri)} {}

std::shared_ptr<std::string> PasteDataRecord::GetHtmlText() const
{
    return this->htmlText_;
}

std::string PasteDataRecord::GetMimeType() const
{
    return this->mimeType_;
}

std::shared_ptr<std::string> PasteDataRecord::GetPlainText() const
{
    return this->plainText_;
}

std::shared_ptr<PixelMap> PasteDataRecord::GetPixelMap() const
{
    return this->pixelMap_;
}

std::shared_ptr<OHOS::Uri> PasteDataRecord::GetUri() const
{
    return this->uri_;
}

std::shared_ptr<OHOS::AAFwk::Want> PasteDataRecord::GetWant() const
{
    return this->want_;
}

std::string PasteDataRecord::ConvertToText() const
{
    if (this->htmlText_) {
        return *this->htmlText_;
    } else if (this->plainText_) {
        return *this->plainText_;
    } else if (this->uri_) {
        return this->uri_->ToString();
    } else {
        return "";
    }
}

bool PasteDataRecord::Marshalling(Parcel &parcel, std::shared_ptr<std::string> item)
{
    if (!parcel.WriteBool(item != nullptr)) {
        PASTEBOARD_HILOGE(PASTEBOARD_MODULE_CLIENT, "WriteBool failed.");
        return false;
    }
    if (item == nullptr) {
        PASTEBOARD_HILOGD(PASTEBOARD_MODULE_CLIENT, "no data provide.");
        return true;
    }
    return parcel.WriteString16(Str8ToStr16(*item));
}

bool PasteDataRecord::Marshalling(Parcel &parcel, std::shared_ptr<Parcelable> item)
{
    if (!parcel.WriteBool(item != nullptr)) {
        PASTEBOARD_HILOGE(PASTEBOARD_MODULE_CLIENT, "WriteBool failed.");
        return false;
    }
    if (item == nullptr) {
        PASTEBOARD_HILOGD(PASTEBOARD_MODULE_CLIENT, "no data provide.");
        return true;
    }
    return parcel.WriteParcelable(item.get());
}

bool PasteDataRecord::Marshalling(Parcel &parcel) const
{
    if (!parcel.WriteString16(Str8ToStr16(mimeType_))) {
        PASTEBOARD_HILOGE(PASTEBOARD_MODULE_CLIENT, "write mimeType failed, mimeType = %{public}s.", mimeType_.c_str());
        return false;
    }
    PASTEBOARD_HILOGD(PASTEBOARD_MODULE_CLIENT, "mimeType = %{public}s,", mimeType_.c_str());
    bool ret = Marshalling(parcel, htmlText_);
    ret = Marshalling(parcel, want_) && ret;
    ret = Marshalling(parcel, plainText_) && ret;
    ret = Marshalling(parcel, uri_) && ret;
    ret = Marshalling(parcel, pixelMap_) && ret;
    return ret;
}

template<typename T> bool PasteDataRecord::UnMarshalling(Parcel &parcel, std::shared_ptr<T> &item)
{
    if (!parcel.ReadBool()) {
        PASTEBOARD_HILOGD(PASTEBOARD_MODULE_CLIENT, "no data provide.");
        return true;
    }
    std::shared_ptr<T> parcelAble(parcel.ReadParcelable<T>());
    if (!parcelAble) {
        PASTEBOARD_HILOGE(PASTEBOARD_MODULE_CLIENT, "ReadParcelable failed.");
        return false;
    }
    item = move(parcelAble);
    return true;
}

bool PasteDataRecord::UnMarshalling(Parcel &parcel, std::shared_ptr<std::string> &item)
{
    if (!parcel.ReadBool()) {
        PASTEBOARD_HILOGD(PASTEBOARD_MODULE_CLIENT, "no data provide.");
        return true;
    }
    item = std::make_shared<std::string>(Str16ToStr8(parcel.ReadString16()));
    if (!item) {
        PASTEBOARD_HILOGE(PASTEBOARD_MODULE_CLIENT, "ReadString16 failed.");
        return false;
    }
    return true;
}

PasteDataRecord *PasteDataRecord::Unmarshalling(Parcel &parcel)
{
    PASTEBOARD_HILOGD(PASTEBOARD_MODULE_CLIENT, "start.");
    auto pasteDataRecord = new (std::nothrow) PasteDataRecord();

    if (pasteDataRecord == nullptr) {
        PASTEBOARD_HILOGD(PASTEBOARD_MODULE_CLIENT, "pasteDataRecord is nullptr.");
        return pasteDataRecord;
    }
    pasteDataRecord->mimeType_ = Str16ToStr8(parcel.ReadString16());
    PASTEBOARD_HILOGD(PASTEBOARD_MODULE_CLIENT, "mimeType = %{public}s,", pasteDataRecord->mimeType_.c_str());

    bool ret = UnMarshalling(parcel, pasteDataRecord->htmlText_);
    ret = UnMarshalling(parcel, pasteDataRecord->want_) && ret;
    ret = UnMarshalling(parcel, pasteDataRecord->plainText_) && ret;
    ret = UnMarshalling(parcel, pasteDataRecord->uri_) && ret;
    ret = UnMarshalling(parcel, pasteDataRecord->pixelMap_) && ret;
    if (!ret) {
        PASTEBOARD_HILOGD(PASTEBOARD_MODULE_CLIENT, "UnMarshalling failed.");
        delete pasteDataRecord;
        pasteDataRecord = nullptr;
    }
    PASTEBOARD_HILOGD(PASTEBOARD_MODULE_CLIENT, "end.");
    return pasteDataRecord;
}
} // MiscServices
} // OHOS