/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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
#include "serializable/tlv_object.h"

#include <cstring>

#include "parcel.h"
namespace OHOS::MiscServices {
bool TLVObject::Write(std::vector<std::uint8_t> &buffer, uint16_t type, bool value)
{
    return WriteBasic(buffer, type, (int8_t)(value));
}
bool TLVObject::Write(std::vector<std::uint8_t> &buffer, uint16_t type, int8_t value)
{
    return WriteBasic(buffer, type, value);
}
bool TLVObject::Write(std::vector<std::uint8_t> &buffer, uint16_t type, int16_t value)
{
    return WriteBasic(buffer, type, value);
}
bool TLVObject::Write(std::vector<std::uint8_t> &buffer, uint16_t type, int32_t value)
{
    return WriteBasic(buffer, type, value);
}
bool TLVObject::Write(std::vector<std::uint8_t> &buffer, uint16_t type, int64_t value)
{
    return WriteBasic(buffer, type, value);
}
bool TLVObject::Write(std::vector<std::uint8_t> &buffer, uint16_t type, const std::string &value)
{
    if (!Check(buffer, sizeof(TLVHead) + value.size())) {
        return false;
    }
    auto *tlvHead = reinterpret_cast<TLVHead *>(buffer.data() + cursor_);
    tlvHead->tag = type;
    tlvHead->len = value.size();
    memcpy(tlvHead->value, value.c_str(), value.size());
    cursor_ += sizeof(TLVHead) + value.size();
    return true;
}

bool TLVObject::Write(std::vector<std::uint8_t> &buffer, uint16_t type, Parcel &value)
{
    if (!Check(buffer, sizeof(TLVHead))) {
        return false;
    }
    auto *tlvHead = reinterpret_cast<TLVHead *>(buffer.data() + cursor_);
    tlvHead->tag = HostToNet(type);
    cursor_ += sizeof(TLVHead);
    auto data = value.GetData();
    auto size = value.GetDataSize();
    memcpy(buffer.data() + cursor_, reinterpret_cast<const void *>(data), size);
    cursor_ += size;
    tlvHead->len = HostToNet(size);
    return true;
}

bool TLVObject::ReadHead(const std::vector<std::uint8_t> &buffer, TLVHead &head)
{
    if (!Check(buffer, sizeof(TLVHead))) {
        return false;
    }
    const auto *pHead = reinterpret_cast<const TLVHead *>(buffer.data() + cursor_);
    if (!Check(buffer, NetToHost(pHead->len) + sizeof(TLVHead))) {
        return false;
    }
    head.tag = NetToHost(pHead->tag);
    head.len = NetToHost(pHead->len);
    cursor_ += sizeof(TLVHead);
    return true;
}

bool TLVObject::ReadValue(const std::vector<std::uint8_t> &buffer, bool &value, const TLVHead &head)
{
    return ReadBasicValue(buffer, value, head);
}
bool TLVObject::ReadValue(const std::vector<std::uint8_t> &buffer, int8_t &value, const TLVHead &head)
{
    return ReadBasicValue(buffer, value, head);
}
bool TLVObject::ReadValue(const std::vector<std::uint8_t> &buffer, int16_t &value, const TLVHead &head)
{
    return ReadBasicValue(buffer, value, head);
}
bool TLVObject::ReadValue(const std::vector<std::uint8_t> &buffer, int32_t &value, const TLVHead &head)
{
    return ReadBasicValue(buffer, value, head);
}

bool TLVObject::ReadValue(const std::vector<std::uint8_t> &buffer, int64_t &value, const TLVHead &head)
{
    return ReadBasicValue(buffer, value, head);
}
bool TLVObject::ReadValue(const std::vector<std::uint8_t> &buffer, std::string &value, const TLVHead &head)
{
    if (!Check(buffer, head.len)) {
        return false;
    }
    value.append(reinterpret_cast<const char *>(buffer.data() + cursor_), head.len);
    cursor_ += head.len;
    return true;
}
bool TLVObject::ReadValue(const std::vector<std::uint8_t> &buffer, TLVObject &value, const TLVHead &head)
{
    return value.Decode(buffer, cursor_, cursor_ + head.len);
}

bool TLVObject::ReadValue(const std::vector<std::uint8_t> &buffer, Parcel &value, const TLVHead &head)
{
    if (!Check(buffer, head.len)) {
        return false;
    }
    value.ParseFrom(reinterpret_cast<uintptr_t>(buffer.data() + cursor_), head.len);
    cursor_ += head.len;
    return true;
}
bool TLVObject::Encode(std::vector<std::uint8_t> &buffer, size_t &cursor, size_t total)
{
    cursor_ = cursor;
    total_ = total;
    bool ret = Encode(buffer);
    cursor = cursor_;
    return ret;
}
bool TLVObject::Decode(const std::vector<std::uint8_t> &buffer, size_t &cursor, size_t total)
{
    cursor_ = cursor;
    total_ = total;
    bool ret = Decode(buffer);
    cursor = cursor_;
    return ret;
}
} // namespace OHOS::MiscServices
