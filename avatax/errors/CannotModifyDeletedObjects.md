---
layout: page
title: CannotModifyDeletedObjects
number: 121
categories: [AvaTax Error Codes]
disqus: 0
---

## Summary

If an object has been deleted, you may not modify it further after its deletion.

## Example

    {
      "code": "CannotModifyDeletedObjects",
      "target": "Unknown",
      "details": [
        {
          "code": "CannotModifyDeletedObjects",
          "number": 121,
          "message": "You cannot modify an object to set its inactive / deleted flag.  To delete an object, call DELETE.",
          "faultCode": "Client",
          "helpLink": "http://developer.avalara.com/avatax/errors/CannotModifyDeletedObjects",
          "severity": "Error"
        }
      ]
    }

## Explanation

Deleting objects is done via the DELETE endpoint.  

Once an object has been deleted, its URL is reserved and may not be reused.