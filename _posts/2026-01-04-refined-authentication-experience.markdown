---
layout: post
title:  "A Refined Authentication Experience"
date:   2026-01-04 12:00:00 +0100
categories: engineering authentication
---

In a large-scale consumer application, it is vital that the authentication experience is both secure and intuitive. The Just Eat Takeaway application has taken significant strides in consolidating and improving its authentication experience. As we enter the new year, and ahead of more developments, let's take a look at the journey so far.

## A new app

One of the most significant changes to the Just Eat Takeaway app offering is the migration to a single application. As we migrated users from a legacy application to the new offering, we needed a way to migrate users as they launched the update for the first time, ensuring they remained logged in. Implemented as a background operation, this was a significant achievement and served as the basis for future authentication improvements.

## A platform

Security is only as strong as its weakest point. Many of the significant changes in and around authentication have focused on the removal of passwords (see passkeys, for example). We have done the same. Prone to error and cumbersome, passwords are a security risk. With the new passwordless login screen, the application now leverages Multi-Factor Authentication. This reduces the risk of brute-force and credential-stuffing attacks and also improves the user experience. In a few seamless steps, a code is emailed to the user and, when submitted, the user is logged in.

Behind the scenes, the application also leverages security features such as [Apple's DeviceCheck](https://developer.apple.com/documentation/devicecheck), ensuring device legitimacy with a device token that is checked against the API service. The result of these developments is a streamlined experience that improves both security and usability for our users while serving as a baseline for optimisations going forward. If you would like more insight, I have written [here](https://danlages.com/authentication/2026/01/03/implementing-secure-login.html) about the development journey of this flow and how it was achieved.

<div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
  <img src="/assets/images/posts/legacy-login.png" alt="Legacy login screen" width="204">
  <img src="/assets/images/posts/new-login.png" alt="New login screen" width="189">
  <img src="/assets/images/posts/create-account.png" alt="Create account screen" width="189">
</div>

*The progression of the login and create account experience*

## Optimising the Authentication Domain

In a modular architecture, you'll often have an engineering team responsible for one or more modules. My domain, authentication, has prominent responsibility within the iOS consumer application: the creation and management of user information and authentication sessions.

### Streamlined

Behind the scenes, the passwordless login experience also paved the way for a modern architecture. The complete account flow, written fully in SwiftUI, allows users to create an account as part of the same passwordless experience. Recognising that the email is not registered, the flow will prompt the user to complete their account.

<div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
  <img src="/assets/images/posts/legacy-create-account.png" alt="Legacy create account flow" width="240">
  <img src="/assets/images/posts/new-complete-account.png" alt="New complete account flow" width="240">
</div>

*Pictured is the legacy create account flow (left) and the new complete account flow (right), which is an extension of the passwordless screen.*

The completion of this user journey facilitated the removal of all password flows. No longer do users need to set a new password. The guest checkout experience was also removed. Together with account deletion (also rewritten in SwiftUI), the result is a domain that is concentrated on a few delightful experiences that are modern in architecture and serve as a robust baseline for iteration.

<div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
  <img src="/assets/images/posts/change-password.png" alt="Change password flow" width="226">
  <img src="/assets/images/posts/account-deletion.png" alt="Account deletion screen" width="226">
</div>

*Pictured is the now removed change password flow (left) and the SwiftUI based Account deletion screen.*

The result of these changes is a domain that is mainly written in SwiftUI, lightweight, and modularised. This was a targeted effort, intentionally moving the codebase to a modern architecture and away from UIKit.

### A global domain

Much of the consolidation effort has been about adopting global endpoints. This enabled a large refactoring of the business logic. No longer are we calling different endpoints depending on where the user is situated. This immediately reduced the complexity required within the iOS application. This development, enabled by the backend team, highlights an important lesson. As an iOS engineer, it is important to collaborate across domains to achieve goals, whether it is endpoint design, testing, or implementation. The adoption of global services benefits both the backend teams, as they look to consolidate their codebases, and the client.

## Getting here

### Recognising when to push

Some tasks cannot be done now. As an engineer in charge of a domain, you'll often want to make improvements. Recognise what initiatives are coming up and whether your time is best spent on optimisation now or if it can be handled as part of a new piece of work. Recognising this allows you to plan your roadmap and communicate when a given change will be delivered to any stakeholders. This will be important as you prioritise your work and push back against changes that may hinder higher-priority initiatives.

This was particularly pertinent for the migration of endpoints to async/await syntax. Understanding that we would soon be adopting new endpoints allowed for the reprioritisation of async/await and, instead, a focus on the SwiftUI implementation of login.

### Iterate fast

You will often get bursts of inspiration when tackling a domain; lean into this. Many paradigms within iOS engineering are lightweight and fairly easy to implement. So, if you find, like me, that you have inherited a largely UIKit-based codebase, rewrite it. Do it when it makes sense and focus on the right priorities, but there is often no better time to start the work. The current implementation is usually a great guide for what to do.

## Summary

This has been a period of great progress for the Just Eat Takeaway authentication domain. This is the product of not only my work, but also the work of various product owners and engineers over time. The iOS module is refined, robust, and able to deliver a seamless authentication experience. More to come.
